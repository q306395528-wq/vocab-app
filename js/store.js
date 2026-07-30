// 本地存储层：进度、设置、每日统计都保存在浏览器 localStorage
const Store = {
  KEY: "momo_vocab_v1",

  _defaults() {
    return {
      settings: { dailyNew: 15, dailyReviewCap: 200, speechRate: 0.95, voiceName: "", onlineTTS: true },
      progress: {},          // word -> SRS state
      customWords: [],       // 用户导入的自定义单词
      daily: {},             // "YYYY-MM-DD" -> { studied, newLearned, reviewed }
      streak: { count: 0, lastDay: null },
      session: null,         // 当前进行中的学习会话（顺序+进度），用于跨越话次恢复
      createdAt: Date.now()
    };
  },

  data: null,

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      this.data = raw ? { ...this._defaults(), ...JSON.parse(raw) } : this._defaults();
      // 合并 settings 里可能新增的默认字段
      this.data.settings = { ...this._defaults().settings, ...this.data.settings };
    } catch (e) {
      console.warn("读取存储失败，使用默认值", e);
      this.data = this._defaults();
    }
    return this.data;
  },

  save() {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("保存失败", e);
    }
  },

  // 全部单词 = 内置词库 + 自定义词，按 word 去重（自定义优先）
  allWords() {
    const map = new Map();
    (window.BUILTIN_WORDS || []).forEach(w => map.set(w.word.toLowerCase(), w));
    (this.data.customWords || []).forEach(w => map.set(w.word.toLowerCase(), w));
    return Array.from(map.values());
  },

  getState(word) {
    return this.data.progress[word] || null;
  },

  setState(word, state) {
    this.data.progress[word] = state;
    this.save();
  },

  today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  ensureToday() {
    const t = this.today();
    if (!this.data.daily[t]) this.data.daily[t] = { studied: 0, newLearned: 0, reviewed: 0 };
    return this.data.daily[t];
  },

  // 今日已学（认识通过的词数 = 新学 + 复习）——按天累计，跨越话次不清零，次日自动归零
  todayLearned() {
    const d = this.ensureToday();
    return (d.newLearned || 0) + (d.reviewed || 0);
  },

  // 记录一次点击。每次点击都算一次 studied；只有点「认识」通过才计入新词/复习数。
  // isPass: 是否点了认识    isNewPass: 是否是“今天新学的词”第一次通过
  recordReview(isPass, isNewPass) {
    const day = this.ensureToday();
    day.studied += 1;
    if (isPass && isNewPass) day.newLearned += 1;
    else if (isPass) day.reviewed += 1;
    this._bumpStreak();
    this.save();
  },

  _bumpStreak() {
    const t = this.today();
    const s = this.data.streak;
    if (s.lastDay === t) return;
    // 判断昨天是否连续
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const y = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    s.count = s.lastDay === y ? s.count + 1 : 1;
    s.lastDay = t;
  },

  // 今日待办：到期复习 + 未超过每日上限的新词
  getQueue() {
    const now = Date.now();
    const all = this.allWords();
    const dueReview = [];
    const newWords = [];
    for (const w of all) {
      const st = this.getState(w.word);
      if (!st || st.status === "new") {
        newWords.push(w);
      } else if (st.due <= now) {
        dueReview.push({ w, due: st.due });
      }
    }
    dueReview.sort((a, b) => a.due - b.due);

    const day = this.ensureToday();
    const newRemaining = Math.max(0, this.data.settings.dailyNew - day.newLearned);
    const newBatch = newWords.slice(0, newRemaining);

    return {
      review: dueReview.map(x => x.w),
      newWords: newBatch,
      totalNewAvailable: newWords.length,
      newRemaining
    };
  },

  counts() {
    const all = this.allWords();
    let learning = 0, review = 0, mastered = 0, untouched = 0;
    for (const w of all) {
      const st = this.getState(w.word);
      if (!st || st.status === "new") untouched++;
      else if (st.status === "mastered") mastered++;
      else if (st.status === "review") review++;
      else learning++;
    }
    return { total: all.length, learning, review, mastered, untouched };
  },

  addCustomWords(list) {
    const existing = new Set(this.data.customWords.map(w => w.word.toLowerCase()));
    let added = 0;
    for (const w of list) {
      if (!w.word) continue;
      const key = w.word.toLowerCase();
      if (existing.has(key)) continue;
      this.data.customWords.push(w);
      existing.add(key);
      added++;
    }
    this.save();
    return added;
  },

  resetProgress(word) {
    delete this.data.progress[word];
    this.save();
  },

  resetAll() {
    this.data = this._defaults();
    this.save();
  }
};

window.Store = Store;
