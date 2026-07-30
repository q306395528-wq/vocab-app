// 主程序：视图渲染 + 交互
const App = {
  view: "home",
  session: null,

  speechVoices: [],
  currentVoice: null,

  init() {
    Store.load();
    this.initVoices();
    this.bindNav();
    this.renderStreak();
    this.render();
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
      if (this.speechVoices.length !== prevCount && this.view === "library") this.render();
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
      if (this.view === "library") this.render();
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
    if (this.view === "home") main.innerHTML = this.renderHome();
    else if (this.view === "study") this.renderStudy(main);
    else if (this.view === "stats") main.innerHTML = this.renderStats();
    else if (this.view === "library") main.innerHTML = this.renderLibrary();
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
      const q = Store.getQueue();
      const words = [...q.review, ...q.newWords];
      if (words.length === 0) {
        main.innerHTML = `
          <div class="empty">
            <div class="empty-emoji">🎉</div>
            <div class="empty-title">今日任务已完成</div>
            <p class="muted">明天再来，或去「词库」调整每日新词量。</p>
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
    }
    this.renderCard(main);
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
      this.afterRender();
      return;
    }

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

        ${s.revealed ? "" : `<div class="recall-hint">轻点屏幕查看释义并朗读</div>`}
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
    this.renderStreak();
    this.renderCard(document.getElementById("main"));
  },

  /* ---------------- 统计页 ---------------- */
  renderStats() {
    const c = Store.counts();
    const days = this.lastNDays(14);
    const daily = Store.data.daily;
    const max = Math.max(1, ...days.map(d => (daily[d]?.studied || 0)));
    const bars = days.map(d => {
      const v = daily[d]?.studied || 0;
      const h = Math.round((v / max) * 100);
      const dd = d.slice(5);
      return `<div class="bar-col"><div class="bar" style="height:${Math.max(4, h)}%" title="${d}: ${v}"></div><div class="bar-x">${dd}</div></div>`;
    }).join("");

    const totalStudied = Object.values(daily).reduce((a, b) => a + (b.studied || 0), 0);
    const masteredPct = c.total ? Math.round((c.mastered / c.total) * 100) : 0;

    return `
      <h2 class="page-title">学习统计</h2>
      <section class="grid2">
        <div class="stat-card"><div class="stat-num">${totalStudied}</div><div class="stat-label">累计点击次数</div></div>
        <div class="stat-card"><div class="stat-num">${Store.data.streak.count || 0}</div><div class="stat-label">连续打卡</div></div>
        <div class="stat-card"><div class="stat-num">${c.mastered}</div><div class="stat-label">已掌握词</div></div>
        <div class="stat-card"><div class="stat-num">${masteredPct}%</div><div class="stat-label">掌握率</div></div>
      </section>

      <section class="card">
        <div class="card-row"><b>近 14 天学习量</b></div>
        <div class="chart">${bars}</div>
      </section>

      <section class="card">
        <div class="card-row"><b>掌握进度</b></div>
        <div class="stack-bar">
          <div class="seg seg-mastered" style="width:${this.pctOf(c.mastered, c.total)}%"></div>
          <div class="seg seg-review" style="width:${this.pctOf(c.review, c.total)}%"></div>
          <div class="seg seg-learning" style="width:${this.pctOf(c.learning, c.total)}%"></div>
          <div class="seg seg-new" style="width:${this.pctOf(c.untouched, c.total)}%"></div>
        </div>
        <div class="legend">
          <span><i class="dot seg-mastered"></i>已掌握 ${c.mastered}</span>
          <span><i class="dot seg-review"></i>复习中 ${c.review}</span>
          <span><i class="dot seg-learning"></i>学习中 ${c.learning}</span>
          <span><i class="dot seg-new"></i>未学习 ${c.untouched}</span>
        </div>
      </section>
    `;
  },

  /* ---------------- 词库页 ---------------- */
  renderLibrary() {
    const all = Store.allWords();
    const c = Store.counts();
    const st = Store.data.settings;
    const rows = all.slice(0, 300).map(w => {
      const state = Store.getState(w.word);
      const status = !state || state.status === "new" ? "未学"
        : state.status === "mastered" ? "已掌握"
        : state.status === "review" ? "复习中" : "学习中";
      const cls = !state || state.status === "new" ? "s-new"
        : state.status === "mastered" ? "s-mastered"
        : state.status === "review" ? "s-review" : "s-learning";
      return `<tr>
        <td><b>${this.esc(w.word)}</b><div class="muted small">${this.esc(w.meaning)}</div></td>
        <td><span class="pill ${cls}">${status}</span></td>
      </tr>`;
    }).join("");

    return `
      <h2 class="page-title">词库与设置</h2>

      <section class="card">
        <div class="card-row"><b>每日新词量</b><span class="muted daily-label">${st.dailyNew} 个/天</span></div>
        <input type="range" id="dailyNew" min="5" max="50" step="5" value="${st.dailyNew}" class="slider" />
        <div class="range-label"><span>5</span><span>50</span></div>
      </section>

      <section class="card">
        <div class="card-row"><b>发音</b><button class="btn-mini" id="voiceTest">试听 🔊</button></div>
        <label class="switch-row">
          <span>单词在线发音（更自然，需联网）<br><span class="muted small">单词用有道美音，失败自动回退本地语音；例句仍用本地语音</span></span>
          <input type="checkbox" id="onlineTTS" ${st.onlineTTS !== false ? "checked" : ""} />
        </label>

        <div class="card-row" style="margin-top:16px"><b class="muted small">本地语音（离线备用）</b><button class="btn-mini" id="voiceRefresh">刷新</button></div>
        ${this.speechVoices.length
          ? `<select id="voiceSel" class="voice-sel">${this.voiceOptions()}</select>`
          : `<p class="muted small">暂未读取到可选嗓音。先点「试听」发一次声，再点「刷新」。</p>`}
        <div class="card-row" style="margin-top:14px"><span>本地语速</span><span class="muted rate-label">${(st.speechRate || 0.95).toFixed(2)}×</span></div>
        <input type="range" id="speechRate" min="0.6" max="1.2" step="0.05" value="${st.speechRate || 0.95}" class="slider" />
        <div class="range-label"><span>慢</span><span>快</span></div>
        <p class="muted small" style="margin:10px 0 0">iPhone 提示：单词开在线发音即较自然。整句在线发音免费源都会被浏览器拦，需自建代理（Cloudflare Worker）才行。本地语音里 Safari 只能用「基础」嗓音，<b>下载的「增强」Siri 语音无法被网页调用</b>（苹果限制）。</p>
      </section>

      <section class="card">
        <div class="card-row"><b>导入自定义单词</b></div>
        <p class="muted small">每行一个，格式：<code>单词,释义,例句(可选)</code>。例如：<br><code>diligent,勤奋的,She is a diligent student.</code></p>
        <textarea id="importArea" class="import-area" placeholder="apple,苹果&#10;brave,勇敢的,Be brave."></textarea>
        <button class="btn-primary" id="importBtn">导入</button>
        <span id="importMsg" class="muted small"></span>
      </section>

      <section class="card">
        <div class="card-row"><b>全部单词</b><span class="muted">共 ${c.total} 词</span></div>
        <table class="wordtable">${rows}</table>
        ${all.length > 300 ? `<p class="muted small center">仅显示前 300 个</p>` : ""}
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
    // 例句朗读
    document.querySelectorAll(".ex-speak").forEach(b => {
      b.onclick = (e) => { e.stopPropagation(); this.speak(b.dataset.speak); };
    });
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
  // 发音入口：优先在线（更自然），失败自动回退本地语音
  //   单词/短语 → 有道 dictvoice(美音)，再退 Google
  //   句子     → Google 翻译 TTS
  speak(text) {
    const t = String(text == null ? "" : text).trim();
    if (!t) return;
    const online = Store.data.settings.onlineTTS !== false && navigator.onLine !== false;
    if (!online) { this.speakLocal(t); return; }

    // 整句：免费的在线整句发音（Google 等）都会被浏览器按 Referer 拦掉，直接用本地语音
    const words = t.split(/\s+/);
    const isSentence = /[.!?;:]$/.test(t) || words.length > 4;
    if (isSentence) { this.speakLocal(t); return; }

    // 单词/短语：有道美音（浏览器可直连），失败回退本地
    const youdao = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(t)}&type=2`;
    this.playChain([youdao], () => this.speakLocal(t));
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
