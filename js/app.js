// 主程序：视图渲染 + 交互
const App = {
  view: "study",
  session: null,
  expandedCat: null,

  speechVoices: [],
  currentVoice: null,
  ttsWorker: "https://vocab-tts.q306395528.workers.dev",
  apiBase: "https://vocab-api.q306395528.workers.dev",
  AUTH_KEY: "momo_vocab_auth",
  auth: { token: null, username: null },

  init() {
    Store.load();
    this.loadAuth();
    Store.onSave = () => this.scheduleSync();   // 任何本地保存都触发防抖云同步
    this.initVoices();
    this.bindNav();
    this.renderStreak();
    this.render();
    if (this.auth.token) this.syncPull().catch(() => {});  // 登录状态下启动时拉取并合并
  },

  // 载入系统语音，挑选最自然的英语嗓音（默认嗓音常常最机械，需要主动选）
  // iOS Safari 的语音是异步加载的，且往往要先发生一次朗读才会齐全，所以要在变化时刷新
  initVoices() {
    const pick = () => {
      const all = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
      const prevCount = this.speechVoices.length;
      this.speechVoices = all.filter(v => /^en/i.test(v.lang));
      const saved = Store.data.settings.voiceName;
      let chosen = saved && this.speechVoices.find(v => v.name === saved);
      if (!chosen) chosen = this.bestVoice(this.speechVoices);
      this.currentVoice = chosen || this.currentVoice || null;
      // 语音列表变化后，如果正停留在设置页，刷新下拉框
      if (this.speechVoices.length !== prevCount && this.view === "mine") this.render();
    };
    pick();
    if (window.speechSynthesis && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = pick;
    }
  },

  // 手动刷新语音列表（iOS 上语音常在首次朗读后才出现）
  reloadVoices() {
    try { speechSynthesis.getVoices(); } catch (e) {}
    // 触发一次极短朗读来“唤醒”语音引擎，然后稍后重新读取列表
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0; speechSynthesis.speak(u);
    } catch (e) {}
    setTimeout(() => {
      const all = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
      this.speechVoices = all.filter(v => /^en/i.test(v.lang));
      const saved = Store.data.settings.voiceName;
      this.currentVoice = (saved && this.speechVoices.find(v => v.name === saved)) || this.bestVoice(this.speechVoices) || this.currentVoice;
      if (this.view === "mine") this.render();
    }, 400);
  },

  // 给英语嗓音打分：优先高品质/自然嗓音，排除系统里的“搞怪/机械”嗓音
  bestVoice(voices) {
    if (!voices.length) return null;
    // 苹果系统里的搞怪/低质嗓音，直接排除
    const NOVELTY = /(bad news|good news|bahh|bells|boing|bubbles|cellos|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|fred|junior|kathy|ralph|deranged|hysterical|princess|bruce|agnes|grandma|grandpa|rocko|sandy|shelley|\bflo\b|eddy|reed)/i;
    const GOOD = /(samantha|ava|allison|susan|zoe|evan|nathan|joelle|nicky|serena|karen|moira|tessa|daniel|arthur|aaron|siri)/i;
    const score = (v) => {
      const n = (v.name || "").toLowerCase();
      const lang = (v.lang || "").toLowerCase();
      let s = 0;
      if (/(premium|enhanced|natural|neural)/.test(n)) s += 80;   // 优质/增强嗓音最佳
      if (/samantha/.test(n)) s += 45;                             // 苹果最自然的默认美音
      else if (/google/.test(n)) s += 35;                         // Chrome 的 Google 嗓音
      else if (GOOD.test(n)) s += 22;
      if (NOVELTY.test(n)) s -= 100;
      if (lang === "en-us") s += 12; else if (lang.startsWith("en-gb")) s += 8; else s += 3;
      if (v.localService) s += 2;
      if (v.default) s += 1;
      return s;
    };
    return voices.slice().sort((a, b) => score(b) - score(a))[0];
  },

  bindNav() {
    document.querySelectorAll(".tab").forEach(btn => {
      btn.addEventListener("click", () => {
        this.view = btn.dataset.view;
        document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b === btn));
        this.session = null;
        this.render();
      });
    });
  },

  renderStreak() {
    document.getElementById("streakDays").textContent = Store.data.streak.count || 0;
  },

  render() {
    const main = document.getElementById("main");
    main.scrollTop = 0;
    document.body.classList.toggle("study-mode", this.view === "study");
    if (this.view !== "study") document.body.classList.remove("recall-mode");
    if (this.view === "study") this.renderStudy(main);
    else if (this.view === "stats") main.innerHTML = this.renderStats();
    else if (this.view === "library") main.innerHTML = this.renderLibrary();
    else if (this.view === "mine") main.innerHTML = this.renderMine();
    this.afterRender();
  },

  /* ---------------- 首页 ---------------- */
  renderHome() {
    const q = Store.getQueue();
    const c = Store.counts();
    const day = Store.ensureToday();
    const goal = Store.data.settings.dailyNew;
    const learnedToday = Store.todayLearned();
    const progressPct = Math.min(100, Math.round((day.newLearned / goal) * 100));
    const dueTotal = q.review.length + q.newWords.length;

    return `
      <section class="hero">
        <div class="hero-date">${this.prettyDate()}</div>
        <div class="hero-title">今日待学</div>
        <div class="hero-big">${dueTotal}<span class="unit"> 个</span></div>
        <div class="hero-sub">复习 ${q.review.length} · 新词 ${q.newWords.length} · 今日已学 ${learnedToday}</div>
        <button class="btn-primary big" id="startBtn" ${dueTotal === 0 ? "disabled" : ""}>
          ${dueTotal === 0 ? "今日已完成 🎉" : "开始学习"}
        </button>
      </section>

      <section class="card">
        <div class="card-row">
          <span>今日新词目标</span>
          <span class="muted">${day.newLearned} / ${goal}</span>
        </div>
        <div class="progress"><div class="progress-fill" style="width:${progressPct}%"></div></div>
      </section>

      <section class="grid2">
        <div class="stat-card"><div class="stat-num">${c.mastered}</div><div class="stat-label">已掌握</div></div>
        <div class="stat-card"><div class="stat-num">${c.review + c.learning}</div><div class="stat-label">学习中</div></div>
        <div class="stat-card"><div class="stat-num">${c.untouched}</div><div class="stat-label">未学习</div></div>
        <div class="stat-card"><div class="stat-num">${Store.data.streak.count || 0}</div><div class="stat-label">连续天数</div></div>
      </section>

      <section class="card tip">
        <b>💡 记忆规则</b>
        <p class="muted small">点「认识」= 今天记住了，会安排更久之后再复习；点「模糊 / 忘记」= 今天还没记牢，这个词会在本轮里再次出现，直到你点「认识」才算通过。</p>
      </section>
    `;
  },

  /* ---------------- 学习页 ---------------- */
  renderStudy(main) {
    if (!this.session) {
      // 优先恢复上次未完成的会话（保持原有顺序与进度，不重新洗牌）
      this.session = this.loadSession();
      if (!this.session) {
        const q = Store.getQueue();
        const words = [...q.review, ...q.newWords];
        if (words.length === 0) {
          main.innerHTML = `
            <div class="empty">
              <div class="empty-emoji">🎉</div>
              <div class="empty-title">今日任务已完成</div>
              <p class="muted">明天再来，或去「我的」调整每日新词量、「词库」选择学习分类。</p>
            </div>`;
          return;
        }
        this.session = {
          queue: this.shuffle(words),   // 本轮工作队列（模糊/忘记会把词重新塞回队列）
          index: 0,
          revealed: false,
          total: words.length,          // 本轮不同单词数
          passed: new Set(),            // 已点“认识”通过的词
          newSet: new Set(q.newWords.map(w => w.word)), // 本轮的新词
          taps: 0
        };
        this.saveSession();
      }
    }
    this.renderCard(main);
  },

  // 会话持久化：让「学习」页跨越话次恢复同一顺序与进度，而不是每次重新随机
  saveSession() {
    const s = this.session;
    Store.data.session = s ? {
      date: Store.today(),
      queue: s.queue.map(w => w.word),
      index: s.index,
      total: s.total,
      passed: [...s.passed],
      newSet: [...s.newSet],
      taps: s.taps
    } : null;
    Store.save();
  },

  loadSession() {
    const s = Store.data.session;
    if (!s || s.date !== Store.today()) return null;
    const map = {};
    for (const w of Store.allWords()) map[w.word] = w;
    const queue = (s.queue || []).map(w => map[w]).filter(Boolean);
    if (!queue.length || (s.index || 0) >= queue.length) return null;
    return {
      queue,
      index: s.index || 0,
      revealed: false,
      total: s.total || queue.length,
      passed: new Set(s.passed || []),
      newSet: new Set(s.newSet || []),
      taps: s.taps || 0
    };
  },

  renderCard(main) {
    const s = this.session;

    if (s.index >= s.queue.length) {
      main.innerHTML = `
        <div class="empty">
          <div class="empty-emoji">✅</div>
          <div class="empty-title">本轮完成！</div>
          <p class="muted">掌握 ${s.passed.size} 个单词，共点击 ${s.taps} 次。</p>
          <button class="btn-primary" id="againBtn">继续下一组</button>
          <button class="btn-ghost" id="homeBtn">回首页</button>
        </div>`;
      this.session = null;
      this.saveSession();               // 完成后清除已保存会话
      document.body.classList.remove("recall-mode");
      this.afterRender();
      return;
    }

    // 回忆页（未翻开）锁定滚动；翻开后内容可能超屏，恢复滚动
    document.body.classList.toggle("recall-mode", !s.revealed);

    const word = s.queue[s.index];
    const prev = Store.getState(word.word);
    const st = prev || SRS.newState();
    const isNew = s.newSet.has(word.word);

    const primaryTag = (word.tags && word.tags.length) ? word.tags[0] : "";
    // 计数按“今日已学 / 今日总量”显示，跨越话次持续累计，只在次日归零
    const learnedToday = Store.todayLearned();
    const dayTotal = learnedToday + (s.total - s.passed.size);

    main.innerHTML = `
      <div class="wordcard ${s.revealed ? "is-revealed" : "tappable"}" id="revealZone">
        <div class="wcard-top">
          <div class="wt-left">
            ${this.proficiencyCircle(prev)}
            ${isNew ? '<span class="badge-new">新词</span>' : '<span class="badge-review">复习</span>'}
            ${primaryTag ? `<span class="corner-tag">${this.esc(primaryTag)}</span>` : ""}
          </div>
          <div class="counter-corner">${learnedToday} / ${dayTotal}</div>
        </div>
        <div class="word-main">${this.esc(word.word)}</div>
        <div class="phon-line">
          <span class="accent">美</span>
          <span class="phonetic">${this.esc(word.phonetic || "")}</span>
          <button class="speak" id="speakBtn" title="发音">🔊</button>
        </div>

        <div class="reveal ${s.revealed ? "show" : "hide"}">
          <div class="divider"></div>
          <div class="meaning-row">
            <span class="pos">${this.esc(word.pos || "")}</span>
            <span class="meaning">${this.esc(word.meaning || "")}</span>
          </div>
          ${this.renderExamples(word)}
          ${word.note ? `<div class="section"><div class="section-head">助记</div><p class="mne-note">${this.esc(word.note)}</p></div>` : ""}
          <div class="action-spacer"></div>
        </div>

        ${s.revealed ? "" : `<div class="recall-hint">点空白处查看释义 · 点单词或音标可发音</div>`}
      </div>

      ${s.revealed ? `<div class="actions">${this.gradeButtons(st)}</div>` : ""}
    `;
    this.afterRender();
    // 跳转到新单词（回忆页）时自动朗读；翻开时的朗读由 revealCard 负责
    if (!s.revealed) this.speak(word.word);
  },

  renderExamples(word) {
    let list = (word.examples && word.examples.length)
      ? word.examples
      : (word.example ? [{ en: word.example, zh: word.exampleZh }] : []);
    if (!list.length) return "";
    const items = list.map(e => `
      <div class="ex">
        <div class="ex-en">
          <button class="ex-speak" data-speak="${this.esc(e.en)}" title="朗读例句">🔊</button>
          <span class="ex-text">${this.highlight(e.en, word.word)}</span>
        </div>
        <div class="ex-zh">${this.esc(e.zh || "")}</div>
      </div>`).join("");
    return `<div class="section"><div class="section-head">例句</div>${items}</div>`;
  },

  renderMnemonic(word) {
    const tags = (word.tags || []);
    const note = word.note ? `<p class="mne-note">${this.esc(word.note)}</p>` : "";
    if (!tags.length && !note) return "";
    return `
      <div class="section">
        <div class="section-head">助记</div>
        <div class="mne">
          ${tags.length ? `<span class="ext-tag">扩展</span>` : ""}
          ${note}
          <div class="mne-line"><b>${this.esc(word.word)}</b> <span class="pos">${this.esc(word.pos || "")}</span> ${this.esc(word.meaning)}</div>
          ${tags.length ? `<div class="tags">${tags.map(t => `<span class="tag">${this.esc(t)}</span>`).join("")}</div>` : ""}
        </div>
      </div>`;
  },

  // 熟练度圆圈：填充比例=熟练度，颜色=状态（绿=良好/已掌握，橙=易忘，灰=未学）
  proficiencyCircle(state) {
    const R = 9, CX = 12, CY = 12;
    const ring = c => `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
    if (!state || state.status === "new") {
      return `<svg class="prof" viewBox="0 0 24 24">${ring("var(--new)")}</svg>`;
    }
    const p = state.status === "mastered" ? 1 : Math.max(0.06, SRS.proficiency(state));
    const weak = (state.lapses > 0 && p < 0.6) || (state.difficulty || 0) >= 7.5;
    const color = weak ? "var(--vague)" : "var(--accent)";
    let fill;
    if (p >= 1) {
      fill = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="${color}"/>`;
    } else {
      const a = p * 2 * Math.PI;
      const ex = (CX + R * Math.sin(a)).toFixed(2), ey = (CY - R * Math.cos(a)).toFixed(2);
      const large = p > 0.5 ? 1 : 0;
      fill = `<path d="M${CX},${CY} L${CX},${CY - R} A${R},${R} 0 ${large} 1 ${ex},${ey} Z" fill="${color}"/>`;
    }
    return `<svg class="prof" viewBox="0 0 24 24">${ring(color)}${fill}</svg>`;
  },

  gradeButtons(st) {
    return `
      <div class="grade-row">
        <button class="grade g-know" data-grade="know"><span class="g-main">认识</span><span class="g-sub">${SRS.previewLabel(st, "know")}</span></button>
        <button class="grade g-vague" data-grade="vague"><span class="g-main">模糊</span><span class="g-sub">${SRS.previewLabel(st, "vague")}</span></button>
        <button class="grade g-forget" data-grade="forget"><span class="g-main">忘记</span><span class="g-sub">${SRS.previewLabel(st, "forget")}</span></button>
      </div>`;
  },

  voiceOptions() {
    const cur = this.currentVoice ? this.currentVoice.name : "";
    return this.speechVoices.map(v => {
      const label = `${v.name}${v.lang ? " · " + v.lang : ""}`;
      return `<option value="${this.esc(v.name)}" ${v.name === cur ? "selected" : ""}>${this.esc(label)}</option>`;
    }).join("");
  },

  // 翻开释义并自动朗读当前单词
  revealCard() {
    if (!this.session || this.session.revealed) return;
    this.session.revealed = true;
    this.renderCard(document.getElementById("main"));
    const w = this.session.queue[this.session.index];
    if (w) this.speak(w.word);
  },

  handleGrade(g) {
    const s = this.session;
    const word = s.queue[s.index];
    const isNew = s.newSet.has(word.word);
    const prev = Store.getState(word.word);
    const st = prev || SRS.newState();
    const next = SRS.grade(st, g);
    Store.setState(word.word, next);

    s.taps += 1;
    Store.recordReview(g === "know", g === "know" && isNew);

    if (g === "know") {
      // 通过：从今天的队列里移除（不再塞回）
      s.passed.add(word.word);
    } else {
      // 没记住：隔开若干张卡后再出现（忘记比模糊回来得早），不会紧接着又是这个词
      const remaining = s.queue.length - (s.index + 1);
      const baseGap = g === "forget" ? 5 : 9;                 // 忘记~5张后、模糊~9张后
      const jitter = Math.floor(Math.random() * 3) - 1;       // ±1 随机，避免规律
      let gap = Math.max(3, baseGap + jitter);                // 至少隔 3 张
      if (remaining <= 3) gap = remaining;                    // 队列太短就放到最后
      const insertAt = Math.min(s.queue.length, s.index + 1 + gap);
      s.queue.splice(insertAt, 0, word);
    }

    s.index += 1;
    s.revealed = false;
    this.saveSession();               // 持久化进度，跨越话次可恢复
    this.renderStreak();
    this.renderCard(document.getElementById("main"));
  },

  /* ---------------- 统计页 ---------------- */
  renderStats() {
    const c = Store.counts();
    const daily = Store.data.daily;
    const days = this.lastNDays(14);
    const max = Math.max(1, ...days.map(d => (daily[d]?.studied || 0)));
    const bars = days.map(d => {
      const v = daily[d]?.studied || 0;
      const h = Math.round((v / max) * 100);
      return `<div class="bar-col"><div class="bar" style="height:${Math.max(4, h)}%" title="${d}: ${v}"></div><div class="bar-x">${d.slice(8)}</div></div>`;
    }).join("");

    const totalStudied = Object.values(daily).reduce((a, b) => a + (b.studied || 0), 0);
    const activeDays = Object.values(daily).filter(d => (d.studied || 0) > 0).length;
    const learnedToday = Store.todayLearned();

    return `
      <h2 class="page-title">学习统计</h2>

      <section class="card">
        <div class="mastery">
          ${this.masteryDonut(c)}
          <div class="mastery-legend">
            <div class="ml-row"><span class="dot seg-mastered"></span>已掌握<b>${c.mastered}</b></div>
            <div class="ml-row"><span class="dot seg-review"></span>复习中<b>${c.review}</b></div>
            <div class="ml-row"><span class="dot seg-learning"></span>学习中<b>${c.learning}</b></div>
            <div class="ml-row"><span class="dot seg-new"></span>未学习<b>${c.untouched}</b></div>
          </div>
        </div>
      </section>

      <section class="grid2">
        <div class="stat-card"><div class="stat-num">🔥 ${Store.data.streak.count || 0}</div><div class="stat-label">连续打卡（天）</div></div>
        <div class="stat-card"><div class="stat-num">${learnedToday}</div><div class="stat-label">今日已学</div></div>
        <div class="stat-card"><div class="stat-num">${totalStudied}</div><div class="stat-label">累计学习次数</div></div>
        <div class="stat-card"><div class="stat-num">${activeDays}</div><div class="stat-label">学习天数</div></div>
      </section>

      <section class="card">
        <div class="card-row"><b>学习日历</b><span class="muted small">近 12 周</span></div>
        <div class="heatmap">${this.calendarHeatmap(daily)}</div>
        <div class="heat-legend"><span>少</span><i class="heat-cell heat-l0"></i><i class="heat-cell heat-l1"></i><i class="heat-cell heat-l2"></i><i class="heat-cell heat-l3"></i><i class="heat-cell heat-l4"></i><span>多</span></div>
      </section>

      <section class="card">
        <div class="card-row"><b>未来复习预测</b><span class="muted small">待复习词量</span></div>
        <div class="chart forecast">${this.reviewForecast()}</div>
      </section>

      <section class="card">
        <div class="card-row"><b>近 14 天学习量</b></div>
        <div class="chart">${bars}</div>
      </section>
    `;
  },

  // 掌握环形图（SVG donut），中心显示掌握率
  masteryDonut(c) {
    const total = c.total || 1;
    const segs = [
      { v: c.mastered, color: "var(--mastered)" },
      { v: c.review, color: "var(--review)" },
      { v: c.learning, color: "var(--learning)" },
      { v: c.untouched, color: "var(--new)" },
    ];
    const r = 54, C = 2 * Math.PI * r;
    let offset = 0;
    const arcs = segs.map(s => {
      const len = (s.v / total) * C;
      const el = `<circle cx="70" cy="70" r="${r}" fill="none" stroke="${s.color}" stroke-width="15" stroke-linecap="butt" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-offset}" transform="rotate(-90 70 70)"/>`;
      offset += len;
      return el;
    }).join("");
    const pct = c.total ? Math.round((c.mastered / c.total) * 100) : 0;
    return `<svg viewBox="0 0 140 140" class="donut">
      <circle cx="70" cy="70" r="${r}" fill="none" stroke="var(--line)" stroke-width="15"/>
      ${arcs}
      <text x="70" y="66" text-anchor="middle" class="donut-num">${pct}%</text>
      <text x="70" y="88" text-anchor="middle" class="donut-lbl">掌握率</text>
    </svg>`;
  },

  // 学习日历热力图（近 12 周，GitHub 贡献图风格）
  calendarHeatmap(daily) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const totalDays = 12 * 7;
    const start = new Date(today);
    start.setDate(start.getDate() - (totalDays - 1));
    start.setDate(start.getDate() - start.getDay()); // 对齐到周日
    const level = n => n <= 0 ? 0 : n < 5 ? 1 : n < 10 ? 2 : n < 20 ? 3 : 4;
    const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    let html = "";
    const cur = new Date(start);
    while (cur <= today) {
      const n = (daily[key(cur)] || {}).studied || 0;
      html += `<div class="heat-cell heat-l${level(n)}" title="${key(cur)}: ${n} 次"></div>`;
      cur.setDate(cur.getDate() + 1);
    }
    return html;
  },

  // 未来 7 天待复习词量预测
  reviewForecast() {
    const now = Date.now(), DAY = 86400000;
    const buckets = new Array(8).fill(0); // 0=今天/逾期, 1..7=未来天
    const prog = Store.data.progress || {};
    for (const w in prog) {
      const st = prog[w];
      if (!st || !st.due || st.status === "new") continue;
      const d = Math.ceil((st.due - now) / DAY);
      if (d <= 0) buckets[0]++;
      else if (d <= 7) buckets[d]++;
    }
    const labels = ["今天", "+1", "+2", "+3", "+4", "+5", "+6", "+7"];
    const max = Math.max(1, ...buckets);
    return buckets.map((v, i) =>
      `<div class="bar-col"><div class="bar-n">${v || ""}</div><div class="bar bar-f" style="height:${v ? Math.max(6, Math.round(v / max * 100)) : 2}%"></div><div class="bar-x">${labels[i]}</div></div>`
    ).join("");
  },

  /* ---------------- 词库页 ---------------- */
  /* ---------------- 词库（按分类分组）---------------- */
  renderLibrary() {
    const cats = Store.categories();
    const expand = this.expandedCat;
    const cards = cats.map(cat => {
      const pct = cat.total ? Math.round((cat.mastered / cat.total) * 100) : 0;
      const isOpen = expand === cat.name;
      const words = isOpen ? Store.allWords().filter(w => Store.category(w) === cat.name) : [];
      const rows = words.slice(0, 200).map(w => {
        const state = Store.getState(w.word);
        const pct = !state || state.status === "new" ? "未学" : Math.round(SRS.proficiency(state) * 100) + "%";
        const cn = state && state.counts ? state.counts : { know: 0, vague: 0, forget: 0 };
        const tip = `认识 ${cn.know || 0} · 模糊 ${cn.vague || 0} · 忘记 ${cn.forget || 0}`;
        return `<tr title="${tip}">
          <td class="prof-cell">${this.proficiencyCircle(state)}</td>
          <td><b>${this.esc(w.word)}</b><div class="muted small">${this.esc(w.meaning)}</div></td>
          <td class="prof-pct muted small">${pct}</td>
        </tr>`;
      }).join("");
      return `
      <section class="card cat-card">
        <div class="cat-head" data-cat="${this.esc(cat.name)}">
          <div class="cat-info">
            <div class="cat-name">${this.esc(cat.name)} <span class="muted small">${cat.total} 词</span></div>
            <div class="cat-sub muted small">已掌握 ${cat.mastered} · 学习中 ${cat.learning}</div>
            <div class="progress cat-prog"><div class="progress-fill" style="width:${pct}%"></div></div>
          </div>
          <label class="cat-toggle" title="是否加入学习">
            <input type="checkbox" class="catChk" data-cat="${this.esc(cat.name)}" ${cat.active ? "checked" : ""} />
            <span>学习</span>
          </label>
        </div>
        <button class="cat-expand" data-cat="${this.esc(cat.name)}">${isOpen ? "收起单词 ▲" : "查看单词 ▼"}</button>
        ${isOpen ? `<table class="wordtable">${rows}</table>${words.length > 200 ? `<p class="muted small center">仅显示前 200 个</p>` : ""}` : ""}
      </section>`;
    }).join("");

    return `
      <h2 class="page-title">词库</h2>
      <p class="muted small" style="margin:-4px 4px 12px">勾选「学习」把该分类加入每日学习范围；点分类可展开查看单词。</p>
      ${cards}
    `;
  },

  /* ---------------- 我的（账号 + 设置）---------------- */
  renderMine() {
    const st = Store.data.settings;
    const c = Store.counts();
    const learnedToday = Store.todayLearned();
    const q = Store.getQueue();
    const dueTotal = q.review.length + q.newWords.length;

    return `
      <h2 class="page-title">我的</h2>

      <section class="card">
        <div class="mine-summary">
          <div class="ms-item"><div class="ms-num">${learnedToday}</div><div class="ms-lbl">今日已学</div></div>
          <div class="ms-item"><div class="ms-num">🔥 ${Store.data.streak.count || 0}</div><div class="ms-lbl">连续打卡</div></div>
          <div class="ms-item"><div class="ms-num">${dueTotal}</div><div class="ms-lbl">今日待学</div></div>
          <div class="ms-item"><div class="ms-num">${c.mastered}</div><div class="ms-lbl">已掌握</div></div>
        </div>
      </section>

      ${this.auth.token ? `
      <section class="card">
        <div class="card-row"><b>账号</b><span class="muted">已登录 · ${this.esc(this.auth.username)}</span></div>
        <p class="muted small" style="margin:0 0 12px">学习进度已自动同步到云端，换设备登录同一账号即可继续。</p>
        <div class="auth-actions">
          <button class="btn-primary" id="syncNow">立即同步</button>
          <button class="btn-ghost" id="logoutBtn">退出登录</button>
        </div>
        <span id="authMsg" class="muted small"></span>
      </section>` : `
      <section class="card">
        <div class="card-row"><b>登录 / 注册</b><span class="muted small">同步进度到云端</span></div>
        <p class="muted small" style="margin:0 0 12px">登录后学习进度自动云同步，可在手机、电脑间无缝切换。</p>
        <input id="authUser" class="voice-sel" placeholder="用户名（3-30 位字母/数字/下划线）" autocomplete="username" autocapitalize="none" />
        <input id="authPass" type="password" class="voice-sel" style="margin-top:8px" placeholder="密码（至少 6 位）" autocomplete="current-password" />
        <div class="auth-actions" style="margin-top:12px">
          <button class="btn-primary" id="loginBtn">登录</button>
          <button class="btn-mini" id="registerBtn">注册新账号</button>
        </div>
        <span id="authMsg" class="muted small"></span>
      </section>`}

      <section class="card">
        <div class="card-row"><b>每日新词量</b><span class="muted daily-label">${st.dailyNew} 个/天</span></div>
        <input type="range" id="dailyNew" min="5" max="50" step="5" value="${st.dailyNew}" class="slider" />
        <div class="range-label"><span>5</span><span>50</span></div>
      </section>

      <section class="card">
        <div class="card-row"><b>发音</b><button class="btn-mini" id="voiceTest">试听 🔊</button></div>
        <label class="switch-row">
          <span>在线发音（更自然，需联网）<br><span class="muted small">单词用有道美音、例句用在线 TTS，失败自动回退本地语音</span></span>
          <input type="checkbox" id="onlineTTS" ${st.onlineTTS !== false ? "checked" : ""} />
        </label>

        <div class="card-row" style="margin-top:16px"><b class="muted small">本地语音（离线备用）</b><button class="btn-mini" id="voiceRefresh">刷新</button></div>
        ${this.speechVoices.length
          ? `<select id="voiceSel" class="voice-sel">${this.voiceOptions()}</select>`
          : `<p class="muted small">暂未读取到可选嗓音。先点「试听」发一次声，再点「刷新」。</p>`}
        <div class="card-row" style="margin-top:14px"><span>本地语速</span><span class="muted rate-label">${(st.speechRate || 0.95).toFixed(2)}×</span></div>
        <input type="range" id="speechRate" min="0.6" max="1.2" step="0.05" value="${st.speechRate || 0.95}" class="slider" />
        <div class="range-label"><span>慢</span><span>快</span></div>
        <p class="muted small" style="margin:10px 0 0">在线发音已接入自建 Cloudflare Worker 代理（免费），单词和例句都能自然发音；断网或失败时自动用下面的本地语音。iPhone 本地语音只能用「基础」嗓音，下载的「增强」Siri 语音网页无法调用（苹果限制）。</p>
      </section>

      <section class="card">
        <div class="card-row"><b>导入自定义单词</b></div>
        <p class="muted small">每行一个，格式：<code>单词,释义,例句(可选)</code>。例如：<br><code>diligent,勤奋的,She is a diligent student.</code></p>
        <textarea id="importArea" class="import-area" placeholder="apple,苹果&#10;brave,勇敢的,Be brave."></textarea>
        <button class="btn-primary" id="importBtn">导入</button>
        <span id="importMsg" class="muted small"></span>
      </section>

      <section class="card danger-zone">
        <div class="card-row"><b>清空所有数据</b></div>
        <p class="muted small">会删除全部学习进度、统计和自定义单词，不可恢复。</p>
        <button class="btn-danger" id="resetBtn">清空数据</button>
      </section>
    `;
  },

  /* ---------------- 事件绑定 ---------------- */
  afterRender() {
    const $ = id => document.getElementById(id);

    if ($("startBtn")) $("startBtn").onclick = () => this.switchTo("study");

    // 学习页：点击整个屏幕（未翻开时）即可查看释义
    const mainEl = document.getElementById("main");
    if (mainEl) {
      if (this.view === "study" && this.session && !this.session.revealed) {
        mainEl.onclick = (e) => {
          // 忽略落在按钮等控件上的点击，避免“开始学习/评分”那一下冒泡上来误翻卡
          if (e.target.closest("button, a, input, textarea")) return;
          this.revealCard();
        };
      } else {
        mainEl.onclick = null;
      }
    }
    // 🔊 单独响应，且不触发翻卡
    if ($("speakBtn")) $("speakBtn").onclick = (e) => { e.stopPropagation(); this.speak(this.session.queue[this.session.index].word); };
    // 例句朗读：喇叭按钮 + 点击整句都可读
    document.querySelectorAll(".ex-speak").forEach(b => {
      b.onclick = (e) => { e.stopPropagation(); this.speak(b.dataset.speak); };
    });
    // 点单词 / 音标 / 例句都能发音；回忆页点单词或音标只发音、不翻卡（阻止冒泡到翻卡监听）
    if (this.view === "study" && this.session) {
      const cur = this.session.queue[this.session.index];
      if (cur) {
        const wm = document.querySelector(".word-main");
        const pl = document.querySelector(".phon-line");
        if (wm) wm.onclick = (e) => { e.stopPropagation(); this.speak(cur.word); };
        if (pl) pl.onclick = (e) => { e.stopPropagation(); this.speak(cur.word); };
        document.querySelectorAll(".ex-en").forEach(row => {
          const btn = row.querySelector(".ex-speak");
          row.onclick = () => this.speak(btn ? btn.dataset.speak : row.textContent);
        });
      }
    }
    if ($("againBtn")) $("againBtn").onclick = () => { this.session = null; this.render(); };
    if ($("homeBtn")) $("homeBtn").onclick = () => this.switchTo("home");

    document.querySelectorAll(".grade").forEach(b => {
      b.onclick = () => this.handleGrade(b.dataset.grade);
    });

    if ($("dailyNew")) $("dailyNew").oninput = (e) => {
      Store.data.settings.dailyNew = Number(e.target.value);
      Store.save();
      const label = e.target.closest(".card").querySelector(".daily-label");
      if (label) label.textContent = `${e.target.value} 个/天`;
    };

    if ($("voiceSel")) $("voiceSel").onchange = (e) => {
      Store.data.settings.voiceName = e.target.value;
      Store.save();
      this.currentVoice = this.speechVoices.find(v => v.name === e.target.value) || this.currentVoice;
      this.speak("natural");
    };
    if ($("voiceTest")) $("voiceTest").onclick = () => this.speak("Hello, this is a natural voice.");
    if ($("voiceRefresh")) $("voiceRefresh").onclick = () => this.reloadVoices();
    if ($("onlineTTS")) $("onlineTTS").onchange = (e) => {
      Store.data.settings.onlineTTS = e.target.checked;
      Store.save();
      this.speak("natural");
    };
    if ($("speechRate")) $("speechRate").oninput = (e) => {
      Store.data.settings.speechRate = Number(e.target.value);
      Store.save();
      const label = e.target.closest(".card").querySelector(".rate-label");
      if (label) label.textContent = `${Number(e.target.value).toFixed(2)}×`;
    };
    if ($("speechRate")) $("speechRate").onchange = () => this.speak("natural");

    // 词库分类：勾选加入学习范围 + 展开单词
    document.querySelectorAll(".catChk").forEach(chk => {
      chk.onchange = () => {
        const ok = Store.toggleCategory(chk.dataset.cat);
        if (!ok) { chk.checked = true; alert("至少保留一个分类用于学习"); return; }
        Store.data.session = null;   // 学习范围变了，清掉旧队列，下次进学习重建
        this.session = null;
        this.render();
      };
    });
    document.querySelectorAll(".cat-expand").forEach(btn => {
      btn.onclick = () => {
        this.expandedCat = this.expandedCat === btn.dataset.cat ? null : btn.dataset.cat;
        this.render();
      };
    });

    if ($("loginBtn")) $("loginBtn").onclick = () => this.doAuth("login");
    if ($("registerBtn")) $("registerBtn").onclick = () => this.doAuth("register");
    if ($("syncNow")) $("syncNow").onclick = () => this.syncPull();
    if ($("logoutBtn")) $("logoutBtn").onclick = () => { if (confirm("退出登录？本地进度会保留。")) this.logout(); };

    if ($("importBtn")) $("importBtn").onclick = () => this.doImport();
    if ($("resetBtn")) $("resetBtn").onclick = () => {
      if (confirm("确定清空所有数据吗？此操作不可恢复。")) {
        Store.resetAll();
        this.renderStreak();
        this.render();
      }
    };
  },

  switchTo(view) {
    this.view = view;
    this.session = null;
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.view === view));
    this.render();
  },

  doImport() {
    const text = document.getElementById("importArea").value.trim();
    const msg = document.getElementById("importMsg");
    if (!text) { msg.textContent = "请输入内容"; return; }
    const list = [];
    for (const line of text.split("\n")) {
      const parts = line.split(/[,，\t]/).map(s => s.trim());
      if (!parts[0]) continue;
      list.push({
        word: parts[0],
        meaning: parts[1] || "（未填释义）",
        example: parts[2] || "",
        exampleZh: "",
        phonetic: "",
        pos: "",
        tags: ["自定义"]
      });
    }
    const added = Store.addCustomWords(list);
    msg.textContent = `成功导入 ${added} 个新单词`;
    document.getElementById("importArea").value = "";
    setTimeout(() => this.render(), 800);
  },

  /* ---------------- 工具 ---------------- */
  /* ---------------- 账号 / 云同步 ---------------- */
  loadAuth() {
    try { this.auth = JSON.parse(localStorage.getItem(this.AUTH_KEY)) || { token: null, username: null }; }
    catch (e) { this.auth = { token: null, username: null }; }
  },
  saveAuth() { localStorage.setItem(this.AUTH_KEY, JSON.stringify(this.auth)); },

  apiFetch(path, opts = {}) {
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    if (this.auth.token) headers["Authorization"] = "Bearer " + this.auth.token;
    return fetch(this.apiBase + path, { ...opts, headers });
  },

  async doAuth(mode) {
    const u = (document.getElementById("authUser").value || "").trim();
    const p = document.getElementById("authPass").value || "";
    const msg = document.getElementById("authMsg");
    if (!u || !p) { msg.textContent = "请输入用户名和密码"; return; }
    msg.textContent = mode === "register" ? "注册中…" : "登录中…";
    try {
      const res = await this.apiFetch("/" + mode, { method: "POST", body: JSON.stringify({ username: u, password: p }) });
      const j = await res.json();
      if (!res.ok) { msg.textContent = j.error || "失败"; return; }
      this.auth = { token: j.token, username: j.username };
      this.saveAuth();
      msg.textContent = "同步中…";
      await this.syncPull();
    } catch (e) { msg.textContent = "网络错误，请重试"; }
  },

  logout() {
    this.auth = { token: null, username: null };
    this.saveAuth();
    this.render();
  },

  // 拉取云端并与本地合并，再回推（双向合并，避免任一端丢数据）
  async syncPull() {
    if (!this.auth.token) return;
    const res = await this.apiFetch("/data", { method: "GET" });
    if (res.status === 401) { this.logout(); return; }
    if (!res.ok) return;
    const { data } = await res.json();
    const merged = this.mergeData(Store.exportData(), data);
    Store.importMerged(merged);       // 会触发 onSave→scheduleSync 回推
    this.renderStreak();
    this.render();
    const msg = document.getElementById("authMsg");
    if (msg) msg.textContent = "已同步 " + new Date().toLocaleTimeString();
  },

  async syncPush() {
    if (!this.auth.token) return;
    try {
      const res = await this.apiFetch("/data", { method: "PUT", body: JSON.stringify({ data: Store.exportData() }) });
      if (res.status === 401) this.logout();
    } catch (e) { /* 离线则忽略，下次再推 */ }
  },

  scheduleSync() {
    if (!this.auth.token) return;
    clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => this.syncPush(), 2500);
  },

  // 合并本地与云端数据：进度取最近复习、每日取各项最大、连续取较大、自定义词取并集
  mergeData(local, remote) {
    if (!remote) return local;
    const m = { ...local };

    m.progress = { ...(remote.progress || {}) };
    const lp = local.progress || {};
    for (const w in lp) {
      const a = lp[w], b = m.progress[w];
      if (!b || (a.lastReview || 0) >= (b.lastReview || 0)) m.progress[w] = a;
    }

    m.daily = { ...(remote.daily || {}) };
    const ld = local.daily || {};
    for (const d in ld) {
      const a = ld[d], b = m.daily[d] || {};
      m.daily[d] = {
        studied: Math.max(a.studied || 0, b.studied || 0),
        newLearned: Math.max(a.newLearned || 0, b.newLearned || 0),
        reviewed: Math.max(a.reviewed || 0, b.reviewed || 0),
      };
    }

    const ls = local.streak || { count: 0 }, rs = remote.streak || { count: 0 };
    m.streak = (ls.count || 0) >= (rs.count || 0) ? ls : rs;

    const cw = {};
    (remote.customWords || []).forEach(w => cw[w.word] = w);
    (local.customWords || []).forEach(w => cw[w.word] = w);
    m.customWords = Object.values(cw);

    m.settings = { ...(remote.settings || {}), ...(local.settings || {}) };
    m.createdAt = Math.min(local.createdAt || Date.now(), remote.createdAt || Date.now());
    return m;
  },

  // 发音入口：优先在线（更自然），失败自动回退本地语音
  //   单词/短语 → 有道 dictvoice(美音)，再退 Google
  //   句子     → Google 翻译 TTS
  speak(text) {
    const t = String(text == null ? "" : text).trim();
    if (!t) return;
    const online = Store.data.settings.onlineTTS !== false && navigator.onLine !== false;
    if (!online) { this.speakLocal(t); return; }

    const worker = this.ttsWorker ? `${this.ttsWorker}/?text=${encodeURIComponent(t)}` : null;
    const words = t.split(/\s+/);
    const isSentence = /[.!?;:]$/.test(t) || words.length > 4;

    if (isSentence) {
      // 整句：走 Worker（服务端代理 Google，自然发音），失败回退本地
      this.playChain(worker ? [worker] : [], () => this.speakLocal(t));
    } else {
      // 单词/短语：有道美音（最快），失败退 Worker，再退本地
      const youdao = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(t)}&type=2`;
      this.playChain(worker ? [youdao, worker] : [youdao], () => this.speakLocal(t));
    }
  },

  // 依次尝试若干音频地址，都失败则调用 fallback
  playChain(urls, fallback) {
    try { speechSynthesis.cancel(); } catch (e) {}
    if (this._audio) { try { this._audio.pause(); } catch (e) {} this._audio = null; }
    let i = 0;
    const tryNext = () => {
      if (i >= urls.length) { if (fallback) fallback(); return; }
      const audio = new Audio(urls[i++]);
      this._audio = audio;
      audio.onerror = tryNext;
      const p = audio.play();
      if (p && p.catch) p.catch(tryNext);
    };
    tryNext();
  },

  // 本地语音合成（离线/在线失败时）
  speakLocal(text) {
    try {
      const u = new SpeechSynthesisUtterance(text);
      if (this.currentVoice) { u.voice = this.currentVoice; u.lang = this.currentVoice.lang; }
      else u.lang = "en-US";
      u.rate = Store.data.settings.speechRate || 0.95;
      u.pitch = 1.0;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) { /* 某些环境不支持 */ }
  },

  // 在例句里高亮单词本身（含常见变形的简单匹配）
  highlight(sentence, word) {
    const safe = this.esc(sentence || "");
    if (!word) return safe;
    try {
      const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\w*\\b`, "gi");
      return safe.replace(re, m => `<span class="hl">${m}</span>`);
    } catch (e) {
      return safe;
    }
  },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  lastNDays(n) {
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    }
    return out;
  },

  prettyDate() {
    const d = new Date();
    const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][d.getDay()];
    return `${d.getMonth() + 1}月${d.getDate()}日 ${week}`;
  },

  pctOf(v, total) { return total ? (v / total) * 100 : 0; },
  esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])); }
};

document.addEventListener("DOMContentLoaded", () => App.init());
