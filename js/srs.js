// ============================================================
//  记忆调度算法：基于遗忘曲线的记忆模型（参考 FSRS / DSR 模型）
//  每个单词维护三个量：
//    stability  S  记忆稳定度：保持力，越大越久才忘（单位≈天）
//    difficulty D  单词难度：1~10，越大越难，间隔涨得越慢
//    retrievability R  当前可提取度：距上次复习 t 天后还记得的概率
//  遗忘曲线（幂函数，比纯指数更贴合真实记忆）：
//    R(t) = (1 + FACTOR * t / S) ^ DECAY ，当 t = S 时 R = 目标保持率
//  下次复习安排在 R 降到目标保持率（默认 90%）的时刻。
//  关键思想：
//    · 在快要忘记时复习（R 低）→ 稳定度提升最大（间隔效应）
//    · 简单的词 D 小 → 间隔涨得快；老记不住的词 D 变大 → 间隔涨得慢（每词自适应）
//    · 点「忘记」= 遗忘，稳定度大幅回落并重新学习
// ============================================================

const SRS = {
  DAY: 24 * 60 * 60 * 1000,

  // 遗忘曲线参数
  FACTOR: 19 / 81,
  DECAY: -0.5,
  RETENTION: 0.9,      // 目标保持率：安排复习时希望还能记得的概率

  // 可调权重（经模拟调参）
  W: {
    initS: { forget: 0.4, vague: 1.4, know: 3.0 },   // 新词首评的初始稳定度（天）
    initD: { forget: 7.5, vague: 6.2, know: 5.0 },   // 新词首评的初始难度
    dDelta: { forget: 1.0, vague: 0.35, know: -0.35 }, // 难度变化量
    dRevert: 0.1,       // 难度向中值(5)回归的强度
    sinc: 3.2,          // 成功时稳定度增长基数
    spow: 0.2,          // 稳定度越高增长越慢（收益递减）
    rrate: 1.0,         // 间隔效应：R 越低增长越多
    hardMult: 0.45,     // 「模糊」的增长是「认识」的比例
    minGrow: 0.6,       // 成功时至少增加的天数（保证间隔单调递增）
    lapseBase: 0.5,     // 遗忘后残留稳定度基数
    lapseDpow: 0.25,    // 越难的词遗忘后残留越低
    lapseSpow: 0.2,     // 原本越稳的词遗忘后残留略高
    lapseRrate: 0.3
  },

  newState() {
    return { stability: 0, difficulty: 0, reps: 0, lapses: 0, due: 0, lastReview: 0, status: "new", interval: 0, pass: false };
  },

  clamp(x, lo, hi) { return Math.min(hi, Math.max(lo, x)); },

  // 距上次复习 elapsed 天后的可提取度
  retrievability(elapsedDays, S) {
    if (!S || S <= 0) return 0;
    return Math.pow(1 + this.FACTOR * elapsedDays / S, this.DECAY);
  },

  // 稳定度 S 对应的复习间隔（天）：解 R(t)=RETENTION
  intervalFromStability(S) {
    const t = S / this.FACTOR * (Math.pow(this.RETENTION, 1 / this.DECAY) - 1);
    return Math.max(1, Math.round(t));
  },

  // grade: "know" 认识 | "vague" 模糊 | "forget" 忘记
  grade(state, g, now = Date.now()) {
    const W = this.W;
    const s = { ...state };
    const first = !state.stability || state.stability <= 0;

    if (first) {
      // 首次评价：给初始稳定度/难度（若旧数据带 interval 则据其抬高起点）
      let S0 = W.initS[g];
      if (state.interval && state.interval > 0) {
        const k = g === "forget" ? 0.4 : g === "vague" ? 0.7 : 1;
        S0 = Math.max(S0, state.interval * k);
      }
      s.stability = S0;
      s.difficulty = this.clamp(W.initD[g], 1, 10);
      s.reps = g === "forget" ? 0 : 1;
      s.lapses = g === "forget" ? 1 : 0;
    } else {
      const elapsed = state.lastReview ? Math.max(0, (now - state.lastReview) / this.DAY) : state.stability;
      const R = this.retrievability(elapsed, state.stability);

      // 难度更新（含向中值回归）
      let D = state.difficulty + W.dDelta[g];
      D = D + W.dRevert * (5 - D);
      s.difficulty = this.clamp(D, 1, 10);

      if (g === "forget") {
        // 遗忘：稳定度回落（不会高于原值），越难/原本越不稳残留越低
        let Snew = W.lapseBase
          * Math.pow(s.difficulty, -W.lapseDpow)
          * Math.pow(state.stability + 1, W.lapseSpow)
          * Math.exp((1 - R) * W.lapseRrate);
        s.stability = this.clamp(Snew, 0.3, Math.max(0.3, state.stability));
        s.lapses = (state.lapses || 0) + 1;
        s.reps = 0;
      } else {
        // 成功：稳定度增长。R 越低（越接近遗忘）增长越多；D 越低增长越多
        const hard = g === "vague" ? W.hardMult : 1.0;
        let inc = W.sinc
          * (11 - s.difficulty)
          * Math.pow(state.stability, -W.spow)
          * (Math.exp((1 - R) * W.rrate) - 1);
        inc = Math.max(0, inc) * hard;
        let Snew = state.stability * (1 + inc);
        Snew = Math.max(Snew, state.stability + W.minGrow); // 保证单调增长
        s.stability = Snew;
        s.reps = (state.reps || 0) + 1;
      }
    }

    s.lastReview = now;
    s.interval = this.intervalFromStability(s.stability);
    if (g === "forget") s.status = "learning";
    else s.status = s.interval >= 21 ? "mastered" : "review";
    s.due = now + s.interval * this.DAY;
    s.pass = g === "know";
    return s;
  },

  // 按钮上的间隔提示：认识→「X天后」；模糊/忘记→「今日 / X天后」（今天还会再出现）
  previewLabel(state, g) {
    const next = this.grade(state, g);
    const fut = this.humanizeDays(next.interval);
    return g === "know" ? fut : `今日 / ${fut}`;
  },

  humanizeDays(days) {
    if (days < 1) return "今日";
    if (days < 30) return `${Math.round(days)} 天后`;
    if (days < 365) return `${Math.round(days / 30)} 个月后`;
    return `${(days / 365).toFixed(1)} 年后`;
  }
};

window.SRS = SRS;
