// 内置词库：常见英语单词（可在“词库”页导入自定义单词）
// 字段：word | phonetic 音标 | pos 词性 | meaning 释义 | examples 多条例句[{en,zh}] | note 助记(可选) | tags 分类
window.BUILTIN_WORDS = [
  { word: "abandon", phonetic: "/əˈbændən/", pos: "v.", meaning: "抛弃，放弃", tags: ["CET4"], note: "a(去)+bandon(控制)→放弃控制→抛弃。abandonment n. 抛弃", examples: [
    { en: "He abandoned his car in the snow.", zh: "他把车丢弃在雪地里。" },
    { en: "Never abandon your dreams.", zh: "永远别放弃你的梦想。" },
    { en: "The crew had to abandon the ship.", zh: "船员们不得不弃船。" } ] },
  { word: "ability", phonetic: "/əˈbɪləti/", pos: "n.", meaning: "能力，才能", tags: ["CET4"], note: "able adj. 有能力的 → ability n.；反义 inability 无能", examples: [
    { en: "She has the ability to solve hard problems.", zh: "她有解决难题的能力。" },
    { en: "He showed great ability in music.", zh: "他在音乐上展现出极大的才能。" },
    { en: "We trust in your ability.", zh: "我们相信你的能力。" } ] },
  { word: "absolute", phonetic: "/ˈæbsəluːt/", pos: "adj.", meaning: "绝对的，完全的", tags: ["CET4"], note: "absolutely adv. 绝对地，完全地", examples: [
    { en: "There is no absolute freedom.", zh: "没有绝对的自由。" },
    { en: "I have absolute trust in her.", zh: "我完全信任她。" },
    { en: "That's the absolute truth.", zh: "那是千真万确的事实。" } ] },
  { word: "abstract", phonetic: "/ˈæbstrækt/", pos: "adj.", meaning: "抽象的", tags: ["CET6"], note: "abs(离开)+tract(拉)→从具体中抽离→抽象", examples: [
    { en: "Art can be very abstract.", zh: "艺术可以非常抽象。" },
    { en: "This is an abstract concept.", zh: "这是一个抽象的概念。" },
    { en: "He finds abstract ideas hard.", zh: "他觉得抽象的概念很难懂。" } ] },
  { word: "academic", phonetic: "/ˌækəˈdemɪk/", pos: "adj.", meaning: "学术的，学院的", tags: ["CET4"], note: "academy n. 学院 → academic adj.", examples: [
    { en: "His academic record is excellent.", zh: "他的学业成绩很优秀。" },
    { en: "She pursued an academic career.", zh: "她走上了学术道路。" },
    { en: "The academic year starts in September.", zh: "学年从九月开始。" } ] },
  { word: "accompany", phonetic: "/əˈkʌmpəni/", pos: "v.", meaning: "陪伴，伴随", tags: ["CET6"], note: "ac+company(同伴)→陪伴。accompaniment n. 伴随物", examples: [
    { en: "She accompanied me to the airport.", zh: "她陪我去了机场。" },
    { en: "Thunder often accompanies lightning.", zh: "雷常伴随着闪电。" },
    { en: "He accompanied the singer on the piano.", zh: "他用钢琴为歌手伴奏。" } ] },
  { word: "accurate", phonetic: "/ˈækjərət/", pos: "adj.", meaning: "准确的，精确的", tags: ["CET4"], note: "accuracy n. 准确性；反义 inaccurate", examples: [
    { en: "We need an accurate measurement.", zh: "我们需要一个精确的测量值。" },
    { en: "Her report was accurate and clear.", zh: "她的报告准确又清晰。" },
    { en: "Please keep the data accurate.", zh: "请保持数据准确。" } ] },
  { word: "achieve", phonetic: "/əˈtʃiːv/", pos: "v.", meaning: "实现，取得", tags: ["CET4"], note: "achievement n. 成就", examples: [
    { en: "You can achieve your goals with effort.", zh: "努力就能实现目标。" },
    { en: "They achieved great success.", zh: "他们取得了巨大成功。" },
    { en: "Hard work helps you achieve more.", zh: "努力让你收获更多。" } ] },
  { word: "acknowledge", phonetic: "/əkˈnɒlɪdʒ/", pos: "v.", meaning: "承认，致谢", tags: ["CET6"], note: "ac+knowledge(知道)→公开知道→承认", examples: [
    { en: "He acknowledged his mistake.", zh: "他承认了自己的错误。" },
    { en: "She acknowledged their help warmly.", zh: "她诚挚地感谢他们的帮助。" },
    { en: "They refused to acknowledge the problem.", zh: "他们拒绝承认这个问题。" } ] },
  { word: "acquire", phonetic: "/əˈkwaɪə(r)/", pos: "v.", meaning: "获得，习得", tags: ["CET6"], note: "acquisition n. 获得，收购", examples: [
    { en: "Children acquire language quickly.", zh: "孩子学语言很快。" },
    { en: "He acquired a new skill this year.", zh: "他今年习得了一项新技能。" },
    { en: "The company acquired a rival firm.", zh: "该公司收购了一家竞争对手。" } ] },
  { word: "adapt", phonetic: "/əˈdæpt/", pos: "v.", meaning: "适应，改编", tags: ["CET4"], note: "adaptation n. 适应/改编；adaptable adj. 适应力强的", examples: [
    { en: "Animals adapt to their environment.", zh: "动物会适应环境。" },
    { en: "The novel was adapted into a film.", zh: "这部小说被改编成了电影。" },
    { en: "It's hard to adapt to a new city.", zh: "适应一座新城市并不容易。" } ] },
  { word: "adequate", phonetic: "/ˈædɪkwət/", pos: "adj.", meaning: "足够的，适当的", tags: ["CET6"], note: "反义 inadequate 不足的；adequately adv.", examples: [
    { en: "We have adequate supplies.", zh: "我们有充足的补给。" },
    { en: "Her salary is adequate for now.", zh: "她的薪水目前够用。" },
    { en: "The room had adequate light.", zh: "房间有足够的光线。" } ] },
  { word: "adjust", phonetic: "/əˈdʒʌst/", pos: "v.", meaning: "调整，适应", tags: ["CET4"], note: "adjustment n. 调整", examples: [
    { en: "Please adjust the volume.", zh: "请调整一下音量。" },
    { en: "He adjusted the mirror.", zh: "他调了调镜子。" },
    { en: "It takes time to adjust.", zh: "适应需要时间。" } ] },
  { word: "admire", phonetic: "/ədˈmaɪə(r)/", pos: "v.", meaning: "钦佩，欣赏", tags: ["CET4"], note: "ad+mire(惊奇)→仰慕。admiration n. 钦佩", examples: [
    { en: "I admire her courage.", zh: "我钦佩她的勇气。" },
    { en: "They admired the sunset.", zh: "他们欣赏着日落。" },
    { en: "We all admire his honesty.", zh: "我们都敬佩他的诚实。" } ] },
  { word: "adopt", phonetic: "/əˈdɒpt/", pos: "v.", meaning: "采纳，收养", tags: ["CET4"], note: "adoption n. 采纳/收养。别混 adapt(适应)", examples: [
    { en: "They adopted a new policy.", zh: "他们采纳了新政策。" },
    { en: "The couple adopted a child.", zh: "这对夫妇收养了一个孩子。" },
    { en: "We should adopt a healthier lifestyle.", zh: "我们该采取更健康的生活方式。" } ] },
  { word: "advance", phonetic: "/ədˈvɑːns/", pos: "v./n.", meaning: "前进，进步；预先", tags: ["CET4"], note: "in advance 提前；advanced adj. 先进的", examples: [
    { en: "Technology advances every year.", zh: "技术每年都在进步。" },
    { en: "The army advanced slowly.", zh: "军队缓缓推进。" },
    { en: "Book the tickets in advance.", zh: "提前订好票。" } ] },
  { word: "advantage", phonetic: "/ədˈvɑːntɪdʒ/", pos: "n.", meaning: "优势，好处", tags: ["CET4"], note: "take advantage of 利用；反义 disadvantage", examples: [
    { en: "Speed is our main advantage.", zh: "速度是我们的主要优势。" },
    { en: "Take advantage of this chance.", zh: "抓住这个机会。" },
    { en: "Being tall is an advantage here.", zh: "个子高在这里是个优势。" } ] },
  { word: "aggressive", phonetic: "/əˈɡresɪv/", pos: "adj.", meaning: "好斗的，积极进取的", tags: ["CET6"], note: "ag+gress(走)+ive→走向对方→进攻的", examples: [
    { en: "He has an aggressive style.", zh: "他风格很有攻击性。" },
    { en: "The dog became aggressive.", zh: "那条狗变得很凶。" },
    { en: "They took an aggressive approach.", zh: "他们采取了激进的策略。" } ] },
  { word: "alternative", phonetic: "/ɔːlˈtɜːnətɪv/", pos: "n./adj.", meaning: "替代方案；供选择的", tags: ["CET4"], note: "alter v. 改变 → alternative；alternatively adv.", examples: [
    { en: "Is there an alternative plan?", zh: "有备选方案吗？" },
    { en: "We had no alternative but to wait.", zh: "我们别无选择只能等。" },
    { en: "Solar power is a clean alternative.", zh: "太阳能是一种清洁的替代能源。" } ] },
  { word: "amazing", phonetic: "/əˈmeɪzɪŋ/", pos: "adj.", meaning: "令人惊叹的", tags: ["CET4"], note: "amaze v. 使惊叹 → amazing/amazed", examples: [
    { en: "The view is amazing.", zh: "景色令人惊叹。" },
    { en: "What an amazing story!", zh: "多么精彩的故事！" },
    { en: "She did an amazing job.", zh: "她干得漂亮极了。" } ] },
  { word: "analyze", phonetic: "/ˈænəlaɪz/", pos: "v.", meaning: "分析", tags: ["CET4"], note: "analysis n. 分析；analyst n. 分析师", examples: [
    { en: "Let's analyze the data.", zh: "我们来分析一下数据。" },
    { en: "She analyzed the results carefully.", zh: "她仔细分析了结果。" },
    { en: "We need to analyze the causes.", zh: "我们需要分析原因。" } ] },
  { word: "ancient", phonetic: "/ˈeɪnʃənt/", pos: "adj.", meaning: "古代的，古老的", tags: ["CET4"], note: "反义 modern 现代的", examples: [
    { en: "This is an ancient temple.", zh: "这是一座古老的寺庙。" },
    { en: "Ancient Greece influenced the world.", zh: "古希腊影响了世界。" },
    { en: "They studied ancient history.", zh: "他们研究古代历史。" } ] },
  { word: "anticipate", phonetic: "/ænˈtɪsɪpeɪt/", pos: "v.", meaning: "预期，期待", tags: ["CET6"], note: "anti(前)+cip(拿)→事前拿住→预料", examples: [
    { en: "We anticipate good results.", zh: "我们预期会有好结果。" },
    { en: "She anticipated his question.", zh: "她料到了他的问题。" },
    { en: "Sales are higher than anticipated.", zh: "销量高于预期。" } ] },
  { word: "apparent", phonetic: "/əˈpærənt/", pos: "adj.", meaning: "明显的，表面的", tags: ["CET6"], note: "appear v. 显现 → apparent；apparently adv. 显然", examples: [
    { en: "It was apparent that he was tired.", zh: "很明显他累了。" },
    { en: "There was no apparent reason.", zh: "没有明显的原因。" },
    { en: "Her joy was apparent to all.", zh: "她的喜悦大家都看得出来。" } ] },
  { word: "appeal", phonetic: "/əˈpiːl/", pos: "v./n.", meaning: "呼吁，吸引力", tags: ["CET4"], note: "appealing adj. 有吸引力的", examples: [
    { en: "The idea appeals to me.", zh: "这个想法很吸引我。" },
    { en: "They appealed for help.", zh: "他们呼吁援助。" },
    { en: "The film has wide appeal.", zh: "这部电影很有大众吸引力。" } ] },
  { word: "appreciate", phonetic: "/əˈpriːʃieɪt/", pos: "v.", meaning: "感激，欣赏", tags: ["CET4"], note: "appreciation n. 感激/欣赏", examples: [
    { en: "I appreciate your help.", zh: "我很感激你的帮助。" },
    { en: "She appreciates good music.", zh: "她懂得欣赏好音乐。" },
    { en: "We appreciate your patience.", zh: "感谢您的耐心。" } ] },
  { word: "appropriate", phonetic: "/əˈprəʊpriət/", pos: "adj.", meaning: "适当的，合适的", tags: ["CET4"], note: "反义 inappropriate 不恰当的", examples: [
    { en: "Wear appropriate clothes.", zh: "穿着要得体。" },
    { en: "Choose an appropriate word.", zh: "选一个合适的词。" },
    { en: "That's not appropriate here.", zh: "那在这里不合适。" } ] },
  { word: "approximate", phonetic: "/əˈprɒksɪmət/", pos: "adj.", meaning: "近似的，大约的", tags: ["CET6"], note: "approximately adv. 大约", examples: [
    { en: "Give me an approximate number.", zh: "给我一个大概的数字。" },
    { en: "The approximate cost is $50.", zh: "大约花费五十美元。" },
    { en: "These are approximate figures.", zh: "这些是近似数字。" } ] },
  { word: "arbitrary", phonetic: "/ˈɑːbɪtrəri/", pos: "adj.", meaning: "任意的，武断的", tags: ["GRE"], note: "arbiter n. 裁决者→随裁决者心意→武断", examples: [
    { en: "The choice seemed arbitrary.", zh: "这个选择显得很随意。" },
    { en: "He made an arbitrary decision.", zh: "他做了个武断的决定。" },
    { en: "The rules feel arbitrary.", zh: "这些规则显得很随意。" } ] },
  { word: "articulate", phonetic: "/ɑːˈtɪkjuleɪt/", pos: "v./adj.", meaning: "清晰表达；口齿清楚的", tags: ["GRE"], examples: [
    { en: "She can articulate her ideas well.", zh: "她能清晰地表达想法。" },
    { en: "He is an articulate speaker.", zh: "他是个口齿伶俐的演讲者。" },
    { en: "Try to articulate your feelings.", zh: "试着把你的感受说清楚。" } ] },
  { word: "assess", phonetic: "/əˈses/", pos: "v.", meaning: "评估，评定", tags: ["CET4"], note: "assessment n. 评估", examples: [
    { en: "We need to assess the risk.", zh: "我们需要评估风险。" },
    { en: "Teachers assess students' work.", zh: "老师评定学生的作业。" },
    { en: "It's hard to assess the damage.", zh: "损失很难评估。" } ] },
  { word: "assume", phonetic: "/əˈsjuːm/", pos: "v.", meaning: "假设，承担", tags: ["CET4"], note: "assumption n. 假设；as+sume(拿)→拿来当真", examples: [
    { en: "Let's assume it is true.", zh: "我们假设这是真的。" },
    { en: "She assumed full responsibility.", zh: "她承担了全部责任。" },
    { en: "Don't assume too much.", zh: "别想当然。" } ] },
  { word: "attribute", phonetic: "/əˈtrɪbjuːt/", pos: "v./n.", meaning: "归因于；属性", tags: ["CET6"], note: "attribute A to B 把A归因于B", examples: [
    { en: "She attributes success to luck.", zh: "她把成功归因于运气。" },
    { en: "Patience is his best attribute.", zh: "耐心是他最好的品质。" },
    { en: "They attribute the delay to weather.", zh: "他们把延误归咎于天气。" } ] },
  { word: "authentic", phonetic: "/ɔːˈθentɪk/", pos: "adj.", meaning: "真正的，真实的", tags: ["CET6"], note: "authenticity n. 真实性；反义 fake", examples: [
    { en: "This is authentic Italian food.", zh: "这是正宗的意大利菜。" },
    { en: "The signature is authentic.", zh: "这个签名是真的。" },
    { en: "She gave an authentic account.", zh: "她给出了真实的描述。" } ] },
  { word: "available", phonetic: "/əˈveɪləbl/", pos: "adj.", meaning: "可获得的，有空的", tags: ["CET4"], note: "availability n. 可用性；反义 unavailable", examples: [
    { en: "Are you available tomorrow?", zh: "你明天有空吗？" },
    { en: "Tickets are still available.", zh: "还有票。" },
    { en: "The doctor is not available now.", zh: "医生现在没空。" } ] },
  { word: "aware", phonetic: "/əˈweə(r)/", pos: "adj.", meaning: "意识到的，知道的", tags: ["CET4"], note: "awareness n. 意识；be aware of 意识到", examples: [
    { en: "Are you aware of the risk?", zh: "你意识到风险了吗？" },
    { en: "She is aware of her faults.", zh: "她清楚自己的缺点。" },
    { en: "We must raise public awareness.", zh: "我们必须提高公众意识。" } ] },
  { word: "benefit", phonetic: "/ˈbenɪfɪt/", pos: "n./v.", meaning: "利益，好处；有益于", tags: ["CET4"], note: "beneficial adj. 有益的；bene(好)+fit(做)", examples: [
    { en: "Exercise benefits your health.", zh: "运动有益健康。" },
    { en: "Everyone benefits from the deal.", zh: "人人都从这笔交易中获益。" },
    { en: "The main benefit is speed.", zh: "主要好处是速度快。" } ] },
  { word: "brief", phonetic: "/briːf/", pos: "adj./n.", meaning: "简短的；简报", tags: ["CET4"], note: "briefly adv. 简短地；in brief 简言之", examples: [
    { en: "Keep the message brief.", zh: "信息尽量简短。" },
    { en: "He gave a brief reply.", zh: "他简短地回答。" },
    { en: "Let me brief you on the plan.", zh: "我给你简单说下计划。" } ] },
  { word: "capable", phonetic: "/ˈkeɪpəbl/", pos: "adj.", meaning: "有能力的，能干的", tags: ["CET4"], note: "capability n. 能力；be capable of 能够", examples: [
    { en: "She is capable of great work.", zh: "她能做出色的工作。" },
    { en: "He is a capable manager.", zh: "他是个能干的经理。" },
    { en: "The car is capable of high speed.", zh: "这车能开到很高的速度。" } ] },
  { word: "capacity", phonetic: "/kəˈpæsəti/", pos: "n.", meaning: "容量，能力", tags: ["CET6"], note: "同根 capable；capacious adj. 容量大的", examples: [
    { en: "The hall has a large capacity.", zh: "这个大厅容量很大。" },
    { en: "She has a great capacity for work.", zh: "她的工作能力很强。" },
    { en: "The tank is filled to capacity.", zh: "水箱装满了。" } ] },
  { word: "challenge", phonetic: "/ˈtʃælɪndʒ/", pos: "n./v.", meaning: "挑战", tags: ["CET4"], note: "challenging adj. 有挑战性的", examples: [
    { en: "This is a real challenge.", zh: "这是一个真正的挑战。" },
    { en: "They challenged the decision.", zh: "他们对这个决定提出质疑。" },
    { en: "She loves a good challenge.", zh: "她喜欢有挑战的事。" } ] },
  { word: "circumstance", phonetic: "/ˈsɜːkəmstæns/", pos: "n.", meaning: "情况，环境", tags: ["CET6"], note: "circum(周围)+stance(站)→周围状况", examples: [
    { en: "Under these circumstances, we agree.", zh: "在这种情况下我们同意。" },
    { en: "He adapted to the new circumstances.", zh: "他适应了新的情况。" },
    { en: "It depends on the circumstances.", zh: "这要看具体情况。" } ] },
  { word: "collapse", phonetic: "/kəˈlæps/", pos: "v./n.", meaning: "倒塌，崩溃", tags: ["CET6"], note: "col(一起)+lapse(滑落)→整体塌下", examples: [
    { en: "The old bridge collapsed.", zh: "那座旧桥倒塌了。" },
    { en: "The market collapsed overnight.", zh: "市场一夜之间崩盘。" },
    { en: "He collapsed from exhaustion.", zh: "他累得瘫倒了。" } ] },
  { word: "commit", phonetic: "/kəˈmɪt/", pos: "v.", meaning: "承诺，犯（罪）", tags: ["CET4"], note: "commitment n. 承诺；commit a crime 犯罪", examples: [
    { en: "He committed to the project.", zh: "他全身心投入这个项目。" },
    { en: "She committed a serious error.", zh: "她犯了一个严重的错误。" },
    { en: "They are committed to quality.", zh: "他们对质量尽心尽力。" } ] },
  { word: "complex", phonetic: "/ˈkɒmpleks/", pos: "adj.", meaning: "复杂的", tags: ["CET4"], note: "complexity n. 复杂性；反义 simple", examples: [
    { en: "This is a complex problem.", zh: "这是个复杂的问题。" },
    { en: "The plot is very complex.", zh: "情节非常复杂。" },
    { en: "Human emotions are complex.", zh: "人的情感很复杂。" } ] },
  { word: "comprehensive", phonetic: "/ˌkɒmprɪˈhensɪv/", pos: "adj.", meaning: "全面的，综合的", tags: ["CET6"], note: "comprehend v. 理解，涵盖 → comprehensive", examples: [
    { en: "We made a comprehensive plan.", zh: "我们制定了全面的计划。" },
    { en: "The book gives a comprehensive view.", zh: "这本书给出了全面的视角。" },
    { en: "They offer comprehensive training.", zh: "他们提供综合培训。" } ] },
  { word: "conceive", phonetic: "/kənˈsiːv/", pos: "v.", meaning: "构思，设想", tags: ["GRE"], note: "concept n. 概念；conception n. 构想", examples: [
    { en: "He conceived a brilliant idea.", zh: "他构思出一个绝妙的主意。" },
    { en: "I can't conceive of such a thing.", zh: "我无法想象这种事。" },
    { en: "The plan was well conceived.", zh: "这个计划构思得很好。" } ] },
  { word: "consequence", phonetic: "/ˈkɒnsɪkwəns/", pos: "n.", meaning: "结果，后果", tags: ["CET4"], note: "consequently adv. 因此", examples: [
    { en: "Every action has consequences.", zh: "每个行为都有后果。" },
    { en: "He ignored the consequences.", zh: "他无视了后果。" },
    { en: "As a consequence, prices rose.", zh: "结果是物价上涨了。" } ] },
  { word: "consistent", phonetic: "/kənˈsɪstənt/", pos: "adj.", meaning: "一致的，始终如一的", tags: ["CET4"], note: "consistency n. 一致；反义 inconsistent", examples: [
    { en: "Be consistent in your work.", zh: "工作要始终如一。" },
    { en: "His story is consistent.", zh: "他的说法前后一致。" },
    { en: "Keep a consistent style.", zh: "保持一致的风格。" } ] },
  { word: "constitute", phonetic: "/ˈkɒnstɪtjuːt/", pos: "v.", meaning: "构成，组成", tags: ["CET6"], note: "constitution n. 宪法/构成", examples: [
    { en: "These parts constitute the whole.", zh: "这些部分构成整体。" },
    { en: "Twelve months constitute a year.", zh: "十二个月构成一年。" },
    { en: "This constitutes a breach of rules.", zh: "这构成了违规。" } ] },
  { word: "contemporary", phonetic: "/kənˈtemprəri/", pos: "adj.", meaning: "当代的，同时代的", tags: ["CET6"], note: "con(共)+tempor(时间)→同时代", examples: [
    { en: "I like contemporary art.", zh: "我喜欢当代艺术。" },
    { en: "They were contemporary writers.", zh: "他们是同时代的作家。" },
    { en: "The design looks contemporary.", zh: "这个设计很现代。" } ] },
  { word: "context", phonetic: "/ˈkɒntekst/", pos: "n.", meaning: "上下文，语境", tags: ["CET4"], note: "con(共)+text(文本)→上下文", examples: [
    { en: "Words depend on context.", zh: "词义取决于语境。" },
    { en: "Read it in context.", zh: "结合上下文来读。" },
    { en: "The quote was taken out of context.", zh: "这句话被断章取义了。" } ] },
  { word: "contribute", phonetic: "/kənˈtrɪbjuːt/", pos: "v.", meaning: "贡献，促成", tags: ["CET4"], note: "contribution n. 贡献；contribute to 促成", examples: [
    { en: "Everyone contributed ideas.", zh: "每个人都贡献了想法。" },
    { en: "Smoking contributes to disease.", zh: "吸烟会诱发疾病。" },
    { en: "She contributed money to charity.", zh: "她向慈善机构捐了款。" } ] },
  { word: "controversial", phonetic: "/ˌkɒntrəˈvɜːʃl/", pos: "adj.", meaning: "有争议的", tags: ["CET6"], note: "controversy n. 争议", examples: [
    { en: "It is a controversial topic.", zh: "这是个有争议的话题。" },
    { en: "The decision was controversial.", zh: "这个决定颇具争议。" },
    { en: "He made a controversial remark.", zh: "他发表了引起争议的言论。" } ] },
  { word: "convince", phonetic: "/kənˈvɪns/", pos: "v.", meaning: "使信服，说服", tags: ["CET4"], note: "convincing adj. 有说服力的", examples: [
    { en: "You can't convince me.", zh: "你说服不了我。" },
    { en: "She convinced him to stay.", zh: "她说服他留下。" },
    { en: "I'm convinced he is right.", zh: "我确信他是对的。" } ] },
  { word: "crucial", phonetic: "/ˈkruːʃl/", pos: "adj.", meaning: "至关重要的", tags: ["CET6"], note: "近义 critical, vital, essential", examples: [
    { en: "Timing is crucial here.", zh: "时机在这里至关重要。" },
    { en: "This is a crucial moment.", zh: "这是个关键时刻。" },
    { en: "Sleep is crucial for health.", zh: "睡眠对健康至关重要。" } ] },
  { word: "cultivate", phonetic: "/ˈkʌltɪveɪt/", pos: "v.", meaning: "培养，耕作", tags: ["CET6"], note: "culture 同根；cultivation n. 培养", examples: [
    { en: "Cultivate good habits early.", zh: "尽早培养好习惯。" },
    { en: "Farmers cultivate the land.", zh: "农民耕种土地。" },
    { en: "She cultivated many friendships.", zh: "她结交了许多朋友。" } ] },
  { word: "curious", phonetic: "/ˈkjʊəriəs/", pos: "adj.", meaning: "好奇的", tags: ["CET4"], note: "curiosity n. 好奇心", examples: [
    { en: "Children are naturally curious.", zh: "孩子天生好奇。" },
    { en: "I'm curious about your plan.", zh: "我对你的计划很好奇。" },
    { en: "A curious thing happened.", zh: "发生了一件奇怪的事。" } ] },
  { word: "deficit", phonetic: "/ˈdefɪsɪt/", pos: "n.", meaning: "赤字，亏损", tags: ["GRE"], note: "de(去)+fic(做)→做少了→不足", examples: [
    { en: "The budget has a deficit.", zh: "预算出现赤字。" },
    { en: "They ran a huge deficit.", zh: "他们出现了巨额亏损。" },
    { en: "The team overcame a deficit.", zh: "球队扭转了落后的比分。" } ] },
  { word: "define", phonetic: "/dɪˈfaɪn/", pos: "v.", meaning: "定义，界定", tags: ["CET4"], note: "definition n. 定义；definite adj. 明确的", examples: [
    { en: "Please define the term.", zh: "请给这个术语下定义。" },
    { en: "How do you define success?", zh: "你如何定义成功？" },
    { en: "Clear rules define the game.", zh: "明确的规则界定了游戏。" } ] },
  { word: "delicate", phonetic: "/ˈdelɪkət/", pos: "adj.", meaning: "精细的，脆弱的", tags: ["CET6"], note: "delicately adv. 精巧地", examples: [
    { en: "Handle the delicate glass.", zh: "小心处理易碎的玻璃。" },
    { en: "It's a delicate situation.", zh: "这是个微妙的局面。" },
    { en: "She has delicate features.", zh: "她五官精致。" } ] },
  { word: "demonstrate", phonetic: "/ˈdemənstreɪt/", pos: "v.", meaning: "证明，演示", tags: ["CET4"], note: "demonstration n. 演示/示威", examples: [
    { en: "He demonstrated the method.", zh: "他演示了这个方法。" },
    { en: "The results demonstrate progress.", zh: "结果证明有了进步。" },
    { en: "Let me demonstrate how it works.", zh: "我来演示它怎么运作。" } ] },
  { word: "deny", phonetic: "/dɪˈnaɪ/", pos: "v.", meaning: "否认，拒绝", tags: ["CET4"], note: "denial n. 否认；反义 admit", examples: [
    { en: "She denied the rumor.", zh: "她否认了这个谣言。" },
    { en: "He can't deny the facts.", zh: "他无法否认事实。" },
    { en: "They were denied entry.", zh: "他们被拒绝入内。" } ] },
  { word: "derive", phonetic: "/dɪˈraɪv/", pos: "v.", meaning: "源于，得到", tags: ["CET6"], note: "derive from 来自；derivative n. 衍生物", examples: [
    { en: "The word derives from Latin.", zh: "这个词源自拉丁语。" },
    { en: "She derives joy from music.", zh: "她从音乐中获得快乐。" },
    { en: "Many drugs derive from plants.", zh: "许多药物源于植物。" } ] },
  { word: "diminish", phonetic: "/dɪˈmɪnɪʃ/", pos: "v.", meaning: "减少，削弱", tags: ["GRE"], note: "反义 increase, enhance", examples: [
    { en: "His influence diminished.", zh: "他的影响力减弱了。" },
    { en: "Nothing can diminish her spirit.", zh: "没什么能削弱她的斗志。" },
    { en: "The pain slowly diminished.", zh: "疼痛慢慢减轻了。" } ] },
  { word: "distinguish", phonetic: "/dɪˈstɪŋɡwɪʃ/", pos: "v.", meaning: "区分，辨别", tags: ["CET4"], note: "distinct adj. 不同的；distinguished adj. 杰出的", examples: [
    { en: "Can you distinguish the twins?", zh: "你能分辨这对双胞胎吗？" },
    { en: "Distinguish fact from opinion.", zh: "把事实和观点区分开。" },
    { en: "He distinguished himself in war.", zh: "他在战争中声名卓著。" } ] },
  { word: "diverse", phonetic: "/daɪˈvɜːs/", pos: "adj.", meaning: "多样的，不同的", tags: ["CET6"], note: "diversity n. 多样性；diversify v. 使多样化", examples: [
    { en: "We have a diverse team.", zh: "我们的团队很多元。" },
    { en: "The city has a diverse culture.", zh: "这座城市文化多元。" },
    { en: "Their interests are diverse.", zh: "他们的兴趣各不相同。" } ] },
  { word: "dominant", phonetic: "/ˈdɒmɪnənt/", pos: "adj.", meaning: "占主导地位的", tags: ["CET6"], note: "dominate v. 支配；dominance n. 支配地位", examples: [
    { en: "They are the dominant player.", zh: "他们是主导者。" },
    { en: "She has a dominant personality.", zh: "她性格很强势。" },
    { en: "English is the dominant language.", zh: "英语是主导语言。" } ] },
  { word: "efficient", phonetic: "/ɪˈfɪʃnt/", pos: "adj.", meaning: "高效的", tags: ["CET4"], note: "efficiency n. 效率；反义 inefficient", examples: [
    { en: "This is an efficient method.", zh: "这是一个高效的方法。" },
    { en: "She is a very efficient worker.", zh: "她工作效率很高。" },
    { en: "We aim for efficient use of time.", zh: "我们力求高效利用时间。" } ] },
  { word: "elaborate", phonetic: "/ɪˈlæbərət/", pos: "adj./v.", meaning: "详尽的；详细说明", tags: ["CET6"], note: "e+labor(劳动)→费心做的→精心的", examples: [
    { en: "Please elaborate on that.", zh: "请就此详细说明。" },
    { en: "They made elaborate plans.", zh: "他们制定了详尽的计划。" },
    { en: "The costume was very elaborate.", zh: "那套服装非常精致复杂。" } ] },
  { word: "eliminate", phonetic: "/ɪˈlɪmɪneɪt/", pos: "v.", meaning: "消除，淘汰", tags: ["CET4"], note: "elimination n. 消除/淘汰", examples: [
    { en: "We must eliminate errors.", zh: "我们必须消除错误。" },
    { en: "The team was eliminated early.", zh: "这支队伍早早被淘汰。" },
    { en: "Try to eliminate waste.", zh: "尽量消除浪费。" } ] },
  { word: "emerge", phonetic: "/ɪˈmɜːdʒ/", pos: "v.", meaning: "出现，浮现", tags: ["CET6"], note: "e(出)+merge(沉)→从水中浮出", examples: [
    { en: "New problems emerged.", zh: "新的问题出现了。" },
    { en: "The sun emerged from the clouds.", zh: "太阳从云层中露出。" },
    { en: "A leader emerged from the group.", zh: "群体中涌现出一位领袖。" } ] },
  { word: "emphasize", phonetic: "/ˈemfəsaɪz/", pos: "v.", meaning: "强调", tags: ["CET4"], note: "emphasis n. 强调", examples: [
    { en: "I want to emphasize this point.", zh: "我想强调这一点。" },
    { en: "She emphasized the need for care.", zh: "她强调了谨慎的必要。" },
    { en: "He emphasized every word.", zh: "他每个字都加重了语气。" } ] },
  { word: "enhance", phonetic: "/ɪnˈhɑːns/", pos: "v.", meaning: "提高，增强", tags: ["CET6"], note: "enhancement n. 增强", examples: [
    { en: "This will enhance quality.", zh: "这会提升质量。" },
    { en: "Music can enhance your mood.", zh: "音乐能改善你的心情。" },
    { en: "Training enhances performance.", zh: "训练能提升表现。" } ] },
  { word: "essential", phonetic: "/ɪˈsenʃl/", pos: "adj.", meaning: "必要的，本质的", tags: ["CET4"], note: "essence n. 本质；essentially adv. 本质上", examples: [
    { en: "Water is essential to life.", zh: "水对生命至关重要。" },
    { en: "Trust is essential in a team.", zh: "信任对团队必不可少。" },
    { en: "These are the essential tools.", zh: "这些是必备工具。" } ] },
  { word: "evident", phonetic: "/ˈevɪdənt/", pos: "adj.", meaning: "明显的", tags: ["CET6"], note: "evidence n. 证据；evidently adv. 显然", examples: [
    { en: "Her joy was evident.", zh: "她的喜悦显而易见。" },
    { en: "It is evident that he lied.", zh: "很明显他撒谎了。" },
    { en: "The change is clearly evident.", zh: "变化十分明显。" } ] },
  { word: "exaggerate", phonetic: "/ɪɡˈzædʒəreɪt/", pos: "v.", meaning: "夸大，夸张", tags: ["CET6"], note: "exaggeration n. 夸张", examples: [
    { en: "Don't exaggerate the problem.", zh: "别夸大这个问题。" },
    { en: "He tends to exaggerate.", zh: "他爱夸张。" },
    { en: "The story was exaggerated.", zh: "这个故事被夸大了。" } ] },
  { word: "explicit", phonetic: "/ɪkˈsplɪsɪt/", pos: "adj.", meaning: "明确的，清楚的", tags: ["GRE"], note: "反义 implicit 含蓄的", examples: [
    { en: "Give explicit instructions.", zh: "给出明确的指示。" },
    { en: "She was explicit about the rules.", zh: "她把规则讲得很清楚。" },
    { en: "The warning was quite explicit.", zh: "警告相当明确。" } ] },
  { word: "exploit", phonetic: "/ɪkˈsplɔɪt/", pos: "v.", meaning: "利用，开发", tags: ["CET6"], note: "exploitation n. 开发/剥削", examples: [
    { en: "They exploit natural resources.", zh: "他们开发自然资源。" },
    { en: "He exploited the loophole.", zh: "他钻了空子。" },
    { en: "Don't let others exploit you.", zh: "别让别人利用你。" } ] },
  { word: "facilitate", phonetic: "/fəˈsɪlɪteɪt/", pos: "v.", meaning: "促进，使便利", tags: ["GRE"], note: "facile 同根(容易)；facility n. 设施", examples: [
    { en: "Tools facilitate learning.", zh: "工具能促进学习。" },
    { en: "The app facilitates communication.", zh: "这款应用方便了交流。" },
    { en: "Good roads facilitate trade.", zh: "好路便利了贸易。" } ] },
  { word: "fascinate", phonetic: "/ˈfæsɪneɪt/", pos: "v.", meaning: "使着迷", tags: ["CET6"], note: "fascinating adj. 迷人的；fascinated adj. 着迷的", examples: [
    { en: "Space fascinates me.", zh: "太空让我着迷。" },
    { en: "The magic show fascinated the kids.", zh: "魔术表演让孩子们入迷。" },
    { en: "She is fascinated by history.", zh: "她对历史着迷。" } ] },
  { word: "flexible", phonetic: "/ˈfleksəbl/", pos: "adj.", meaning: "灵活的，柔韧的", tags: ["CET4"], note: "flex v. 弯曲；flexibility n. 灵活性", examples: [
    { en: "Our schedule is flexible.", zh: "我们的日程很灵活。" },
    { en: "Try to stay flexible.", zh: "尽量保持灵活。" },
    { en: "The wire is thin and flexible.", zh: "这根金属丝细而柔韧。" } ] },
  { word: "fundamental", phonetic: "/ˌfʌndəˈmentl/", pos: "adj.", meaning: "基本的，根本的", tags: ["CET6"], note: "fund 同根(底)；fundamentally adv. 根本上", examples: [
    { en: "This is a fundamental right.", zh: "这是一项基本权利。" },
    { en: "Honesty is fundamental to trust.", zh: "诚实是信任的根本。" },
    { en: "We must fix the fundamental issue.", zh: "我们必须解决根本问题。" } ] },
  { word: "generate", phonetic: "/ˈdʒenəreɪt/", pos: "v.", meaning: "产生，生成", tags: ["CET4"], note: "generation n. 一代/产生；generator n. 发电机", examples: [
    { en: "The plant generates power.", zh: "这个工厂发电。" },
    { en: "The idea generated much interest.", zh: "这个想法引起了很大兴趣。" },
    { en: "Solar panels generate electricity.", zh: "太阳能板发电。" } ] },
  { word: "genuine", phonetic: "/ˈdʒenjuɪn/", pos: "adj.", meaning: "真正的，真诚的", tags: ["CET6"], note: "近义 authentic；反义 fake", examples: [
    { en: "She showed genuine concern.", zh: "她表现出真诚的关心。" },
    { en: "Is this a genuine diamond?", zh: "这是真钻石吗？" },
    { en: "He has a genuine interest in art.", zh: "他对艺术有真正的兴趣。" } ] },
  { word: "guarantee", phonetic: "/ˌɡærənˈtiː/", pos: "v./n.", meaning: "保证，担保", tags: ["CET4"], examples: [
    { en: "We guarantee quality.", zh: "我们保证质量。" },
    { en: "There's no guarantee of success.", zh: "成功没有保证。" },
    { en: "The watch has a two-year guarantee.", zh: "这块表保修两年。" } ] },
  { word: "hypothesis", phonetic: "/haɪˈpɒθəsɪs/", pos: "n.", meaning: "假设，假说", tags: ["GRE"], note: "复数 hypotheses；hypothetical adj. 假设的", examples: [
    { en: "Test your hypothesis.", zh: "检验你的假设。" },
    { en: "The data support the hypothesis.", zh: "数据支持这一假说。" },
    { en: "It's only a hypothesis so far.", zh: "目前这还只是个假设。" } ] },
  { word: "identical", phonetic: "/aɪˈdentɪkl/", pos: "adj.", meaning: "完全相同的", tags: ["CET6"], note: "identity n. 身份；identify v. 辨认", examples: [
    { en: "The two copies are identical.", zh: "这两份副本完全相同。" },
    { en: "They are identical twins.", zh: "他们是同卵双胞胎。" },
    { en: "The results were nearly identical.", zh: "结果几乎一模一样。" } ] },
  { word: "illustrate", phonetic: "/ˈɪləstreɪt/", pos: "v.", meaning: "说明，举例", tags: ["CET4"], note: "illustration n. 插图/说明", examples: [
    { en: "Let me illustrate with an example.", zh: "让我举个例子说明。" },
    { en: "The chart illustrates the trend.", zh: "图表说明了趋势。" },
    { en: "The book is beautifully illustrated.", zh: "这本书配图精美。" } ] },
  { word: "implement", phonetic: "/ˈɪmplɪment/", pos: "v.", meaning: "实施，执行", tags: ["CET6"], note: "implementation n. 实施", examples: [
    { en: "We will implement the plan.", zh: "我们将执行这个计划。" },
    { en: "The rule was implemented last year.", zh: "这条规定去年开始执行。" },
    { en: "It's hard to implement quickly.", zh: "很难快速落实。" } ] },
  { word: "implicit", phonetic: "/ɪmˈplɪsɪt/", pos: "adj.", meaning: "含蓄的，暗含的", tags: ["GRE"], note: "反义 explicit 明确的", examples: [
    { en: "There was an implicit warning.", zh: "其中有一个含蓄的警告。" },
    { en: "She gave implicit approval.", zh: "她默许了。" },
    { en: "Trust was implicit in the deal.", zh: "这笔交易暗含着信任。" } ] },
  { word: "impose", phonetic: "/ɪmˈpəʊz/", pos: "v.", meaning: "强加，征收", tags: ["CET6"], note: "im(上)+pose(放)→强加于上", examples: [
    { en: "They imposed new rules.", zh: "他们强加了新规则。" },
    { en: "The government imposed a tax.", zh: "政府征收了一项税。" },
    { en: "Don't impose your views on others.", zh: "别把你的观点强加于人。" } ] },
  { word: "incentive", phonetic: "/ɪnˈsentɪv/", pos: "n.", meaning: "激励，动机", tags: ["GRE"], note: "近义 motivation, stimulus", examples: [
    { en: "Money is a strong incentive.", zh: "金钱是强烈的激励。" },
    { en: "They offered a tax incentive.", zh: "他们提供了税收优惠。" },
    { en: "He had no incentive to change.", zh: "他没有改变的动力。" } ] },
  { word: "indicate", phonetic: "/ˈɪndɪkeɪt/", pos: "v.", meaning: "表明，指示", tags: ["CET4"], note: "indication n. 迹象；indicator n. 指标", examples: [
    { en: "The sign indicates danger.", zh: "这个标志表示危险。" },
    { en: "Results indicate a clear trend.", zh: "结果表明了明确的趋势。" },
    { en: "Please indicate your choice.", zh: "请标明你的选择。" } ] },
  { word: "inevitable", phonetic: "/ɪnˈevɪtəbl/", pos: "adj.", meaning: "不可避免的", tags: ["CET6"], note: "inevitably adv. 不可避免地", examples: [
    { en: "Change is inevitable.", zh: "变化是不可避免的。" },
    { en: "War seemed inevitable.", zh: "战争似乎不可避免。" },
    { en: "The outcome was inevitable.", zh: "结果是注定的。" } ] },
  { word: "influence", phonetic: "/ˈɪnfluəns/", pos: "n./v.", meaning: "影响", tags: ["CET4"], note: "influential adj. 有影响力的", examples: [
    { en: "Friends influence us a lot.", zh: "朋友对我们影响很大。" },
    { en: "She has a good influence on him.", zh: "她对他有好的影响。" },
    { en: "Weather influences our mood.", zh: "天气影响我们的情绪。" } ] },
  { word: "innovative", phonetic: "/ˈɪnəveɪtɪv/", pos: "adj.", meaning: "创新的", tags: ["CET6"], note: "innovate v. 创新；innovation n. 创新", examples: [
    { en: "They have an innovative idea.", zh: "他们有一个创新的想法。" },
    { en: "The company is highly innovative.", zh: "这家公司极具创新力。" },
    { en: "We need innovative solutions.", zh: "我们需要创新的方案。" } ] },
  { word: "integrate", phonetic: "/ˈɪntɪɡreɪt/", pos: "v.", meaning: "整合，融入", tags: ["CET6"], note: "integration n. 整合；integral adj. 不可或缺的", examples: [
    { en: "We integrate the two systems.", zh: "我们整合这两个系统。" },
    { en: "He integrated well into the team.", zh: "他很好地融入了团队。" },
    { en: "Try to integrate the ideas.", zh: "试着把这些想法整合起来。" } ] },
  { word: "intense", phonetic: "/ɪnˈtens/", pos: "adj.", meaning: "强烈的，紧张的", tags: ["CET6"], note: "intensity n. 强度；intensify v. 加剧", examples: [
    { en: "The heat was intense.", zh: "热浪很强烈。" },
    { en: "It was an intense debate.", zh: "那是一场激烈的辩论。" },
    { en: "She felt intense pressure.", zh: "她感到巨大的压力。" } ] },
  { word: "justify", phonetic: "/ˈdʒʌstɪfaɪ/", pos: "v.", meaning: "证明…正当", tags: ["CET6"], note: "just(公正)→使正当；justification n. 正当理由", examples: [
    { en: "Can you justify the cost?", zh: "你能证明这个成本合理吗？" },
    { en: "Nothing can justify violence.", zh: "没有什么能为暴力开脱。" },
    { en: "He tried to justify his actions.", zh: "他试图为自己的行为辩解。" } ] },
  { word: "legitimate", phonetic: "/lɪˈdʒɪtɪmət/", pos: "adj.", meaning: "合法的，合理的", tags: ["GRE"], note: "leg(法律)→合法的；反义 illegitimate", examples: [
    { en: "That's a legitimate concern.", zh: "那是个合理的担忧。" },
    { en: "It is a legitimate business.", zh: "这是一家合法的企业。" },
    { en: "He has a legitimate claim.", zh: "他的要求合情合理。" } ] },
  { word: "maintain", phonetic: "/meɪnˈteɪn/", pos: "v.", meaning: "维持，保养", tags: ["CET4"], note: "maintenance n. 维护/保养", examples: [
    { en: "Maintain a healthy diet.", zh: "保持健康饮食。" },
    { en: "They maintain the roads.", zh: "他们养护道路。" },
    { en: "He maintained his innocence.", zh: "他坚称自己无罪。" } ] },
  { word: "manipulate", phonetic: "/məˈnɪpjuleɪt/", pos: "v.", meaning: "操纵，操作", tags: ["GRE"], note: "mani(手)+pul→用手控制；manipulation n. 操纵", examples: [
    { en: "He tried to manipulate them.", zh: "他试图操纵他们。" },
    { en: "She can manipulate the data.", zh: "她能操作这些数据。" },
    { en: "Don't let ads manipulate you.", zh: "别被广告操控。" } ] },
  { word: "modify", phonetic: "/ˈmɒdɪfaɪ/", pos: "v.", meaning: "修改，调整", tags: ["CET6"], note: "modification n. 修改", examples: [
    { en: "We modified the design.", zh: "我们修改了设计。" },
    { en: "You can modify the settings.", zh: "你可以修改设置。" },
    { en: "The plan was slightly modified.", zh: "计划略作了修改。" } ] },
  { word: "neglect", phonetic: "/nɪˈɡlekt/", pos: "v./n.", meaning: "忽视，疏忽", tags: ["CET6"], note: "neg(不)+lect(选)→不去理会", examples: [
    { en: "Don't neglect your health.", zh: "不要忽视健康。" },
    { en: "The garden fell into neglect.", zh: "花园无人打理荒废了。" },
    { en: "He neglected his duties.", zh: "他玩忽职守。" } ] },
  { word: "obscure", phonetic: "/əbˈskjʊə(r)/", pos: "adj.", meaning: "模糊的，鲜为人知的", tags: ["GRE"], note: "反义 obvious, famous", examples: [
    { en: "The meaning is obscure.", zh: "意思很含糊。" },
    { en: "He is an obscure writer.", zh: "他是个鲜为人知的作家。" },
    { en: "Clouds obscured the moon.", zh: "云遮住了月亮。" } ] },
  { word: "obvious", phonetic: "/ˈɒbviəs/", pos: "adj.", meaning: "明显的", tags: ["CET4"], note: "obviously adv. 显然", examples: [
    { en: "The answer is obvious.", zh: "答案很明显。" },
    { en: "It's obvious she's upset.", zh: "很明显她不高兴。" },
    { en: "For obvious reasons, we agreed.", zh: "出于显而易见的原因，我们同意了。" } ] },
  { word: "occur", phonetic: "/əˈkɜː(r)/", pos: "v.", meaning: "发生，出现", tags: ["CET4"], note: "occurrence n. 发生；occur to sb 想到", examples: [
    { en: "Mistakes occur sometimes.", zh: "有时会出错。" },
    { en: "The accident occurred at noon.", zh: "事故发生在正午。" },
    { en: "It never occurred to me.", zh: "我从没想到过。" } ] },
  { word: "overwhelm", phonetic: "/ˌəʊvəˈwelm/", pos: "v.", meaning: "压倒，使不知所措", tags: ["CET6"], note: "overwhelming adj. 压倒性的", examples: [
    { en: "The work overwhelmed her.", zh: "工作让她不堪重负。" },
    { en: "They were overwhelmed by kindness.", zh: "他们被善意深深打动。" },
    { en: "Don't overwhelm yourself.", zh: "别把自己逼得太紧。" } ] },
  { word: "participate", phonetic: "/pɑːˈtɪsɪpeɪt/", pos: "v.", meaning: "参与，参加", tags: ["CET4"], note: "part(部分)→加入其中；participation n. 参与", examples: [
    { en: "Everyone can participate.", zh: "每个人都可以参与。" },
    { en: "She participated in the debate.", zh: "她参加了辩论。" },
    { en: "Few students participate in class.", zh: "很少有学生在课堂上参与。" } ] },
  { word: "perceive", phonetic: "/pəˈsiːv/", pos: "v.", meaning: "感知，认为", tags: ["CET6"], note: "perception n. 感知；per+ceive(拿)→彻底抓住", examples: [
    { en: "How do you perceive risk?", zh: "你如何看待风险？" },
    { en: "We perceive colors differently.", zh: "我们对颜色的感知各不相同。" },
    { en: "She is perceived as a leader.", zh: "她被视为领袖。" } ] },
  { word: "persist", phonetic: "/pəˈsɪst/", pos: "v.", meaning: "坚持，持续", tags: ["CET6"], note: "persistent adj. 坚持不懈的；persistence n. 毅力", examples: [
    { en: "The problem persists.", zh: "这个问题依然存在。" },
    { en: "She persisted despite failure.", zh: "尽管失败她仍坚持。" },
    { en: "If pain persists, see a doctor.", zh: "如疼痛持续，请就医。" } ] },
  { word: "phenomenon", phonetic: "/fəˈnɒmɪnən/", pos: "n.", meaning: "现象", tags: ["CET6"], note: "复数 phenomena", examples: [
    { en: "It's a natural phenomenon.", zh: "这是一种自然现象。" },
    { en: "The trend is a global phenomenon.", zh: "这一趋势是全球现象。" },
    { en: "Scientists study the phenomenon.", zh: "科学家研究这一现象。" } ] },
  { word: "potential", phonetic: "/pəˈtenʃl/", pos: "adj./n.", meaning: "潜在的；潜力", tags: ["CET4"], note: "potentially adv. 潜在地", examples: [
    { en: "She has great potential.", zh: "她潜力很大。" },
    { en: "It's a potential problem.", zh: "这是个潜在的问题。" },
    { en: "He reached his full potential.", zh: "他发挥了全部潜力。" } ] },
  { word: "precise", phonetic: "/prɪˈsaɪs/", pos: "adj.", meaning: "精确的，准确的", tags: ["CET4"], note: "precisely adv. 精确地；precision n. 精度", examples: [
    { en: "Be precise with numbers.", zh: "数字要精确。" },
    { en: "I need the precise time.", zh: "我需要确切的时间。" },
    { en: "Her aim was precise.", zh: "她瞄得很准。" } ] },
  { word: "prohibit", phonetic: "/prəˈhɪbɪt/", pos: "v.", meaning: "禁止", tags: ["CET6"], note: "prohibition n. 禁止；近义 ban, forbid", examples: [
    { en: "Smoking is prohibited here.", zh: "这里禁止吸烟。" },
    { en: "The law prohibits such acts.", zh: "法律禁止此类行为。" },
    { en: "Photography is prohibited inside.", zh: "室内禁止拍照。" } ] },
  { word: "prominent", phonetic: "/ˈprɒmɪnənt/", pos: "adj.", meaning: "突出的，著名的", tags: ["GRE"], note: "pro(前)+min(突)→突出的", examples: [
    { en: "He is a prominent scientist.", zh: "他是一位著名的科学家。" },
    { en: "The sign is in a prominent place.", zh: "标牌在显眼的位置。" },
    { en: "She played a prominent role.", zh: "她扮演了重要角色。" } ] },
  { word: "prospect", phonetic: "/ˈprɒspekt/", pos: "n.", meaning: "前景，可能性", tags: ["CET6"], note: "pro(前)+spect(看)→向前看→前景", examples: [
    { en: "The prospect looks good.", zh: "前景看起来不错。" },
    { en: "There's little prospect of rain.", zh: "几乎不可能下雨。" },
    { en: "Job prospects are improving.", zh: "就业前景在改善。" } ] },
  { word: "reluctant", phonetic: "/rɪˈlʌktənt/", pos: "adj.", meaning: "不情愿的", tags: ["CET6"], note: "reluctantly adv. 勉强地", examples: [
    { en: "He was reluctant to leave.", zh: "他不愿意离开。" },
    { en: "She gave a reluctant nod.", zh: "她勉强点了点头。" },
    { en: "They were reluctant to agree.", zh: "他们不太愿意同意。" } ] },
  { word: "reinforce", phonetic: "/ˌriːɪnˈfɔːs/", pos: "v.", meaning: "加强，巩固", tags: ["CET6"], note: "re(再)+force(力量)→再加力", examples: [
    { en: "Practice reinforces memory.", zh: "练习能巩固记忆。" },
    { en: "They reinforced the wall.", zh: "他们加固了墙。" },
    { en: "This reinforces my point.", zh: "这更印证了我的观点。" } ] },
  { word: "resemble", phonetic: "/rɪˈzembl/", pos: "v.", meaning: "像，类似", tags: ["CET6"], note: "resemblance n. 相似", examples: [
    { en: "She resembles her mother.", zh: "她长得像她妈妈。" },
    { en: "The two plans resemble each other.", zh: "这两个方案彼此相似。" },
    { en: "It resembles a small dog.", zh: "它看起来像只小狗。" } ] },
  { word: "restrict", phonetic: "/rɪˈstrɪkt/", pos: "v.", meaning: "限制，约束", tags: ["CET6"], note: "restriction n. 限制；strict 同根", examples: [
    { en: "We restrict access to the room.", zh: "我们限制进入这个房间。" },
    { en: "The diet restricts sugar.", zh: "这种饮食限制糖分。" },
    { en: "Speed is restricted here.", zh: "这里限速。" } ] },
  { word: "reveal", phonetic: "/rɪˈviːl/", pos: "v.", meaning: "揭示，透露", tags: ["CET4"], note: "反义 conceal 隐藏；revelation n. 揭示", examples: [
    { en: "The study reveals a trend.", zh: "研究揭示了一个趋势。" },
    { en: "He revealed the secret.", zh: "他透露了这个秘密。" },
    { en: "The curtain rose to reveal a stage.", zh: "幕布升起，露出舞台。" } ] },
  { word: "rigorous", phonetic: "/ˈrɪɡərəs/", pos: "adj.", meaning: "严格的，严谨的", tags: ["GRE"], note: "rigor n. 严格；rigorously adv.", examples: [
    { en: "The test was rigorous.", zh: "这个测试很严格。" },
    { en: "They did rigorous research.", zh: "他们做了严谨的研究。" },
    { en: "He follows a rigorous routine.", zh: "他遵循严格的作息。" } ] },
  { word: "significant", phonetic: "/sɪɡˈnɪfɪkənt/", pos: "adj.", meaning: "重要的，显著的", tags: ["CET4"], note: "significance n. 意义；significantly adv.", examples: [
    { en: "There is a significant change.", zh: "有一个显著的变化。" },
    { en: "This is a significant discovery.", zh: "这是一项重要发现。" },
    { en: "Sales rose significantly.", zh: "销量显著上升。" } ] },
  { word: "sophisticated", phonetic: "/səˈfɪstɪkeɪtɪd/", pos: "adj.", meaning: "复杂的，精密的，老练的", tags: ["CET6"], examples: [
    { en: "It's a sophisticated machine.", zh: "这是一台精密的机器。" },
    { en: "She has sophisticated taste.", zh: "她品味老练。" },
    { en: "The software is highly sophisticated.", zh: "这款软件相当精密复杂。" } ] },
  { word: "substantial", phonetic: "/səbˈstænʃl/", pos: "adj.", meaning: "大量的，实质的", tags: ["CET6"], note: "substance n. 物质/实质；substantially adv.", examples: [
    { en: "We made substantial progress.", zh: "我们取得了实质进展。" },
    { en: "He earned a substantial sum.", zh: "他赚了一大笔钱。" },
    { en: "There is substantial evidence.", zh: "有大量的证据。" } ] },
  { word: "sufficient", phonetic: "/səˈfɪʃnt/", pos: "adj.", meaning: "足够的", tags: ["CET4"], note: "sufficiency n. 充足；反义 insufficient", examples: [
    { en: "We have sufficient time.", zh: "我们时间充足。" },
    { en: "Is the light sufficient?", zh: "光线够吗？" },
    { en: "There is sufficient evidence.", zh: "证据充分。" } ] },
  { word: "suspend", phonetic: "/səˈspend/", pos: "v.", meaning: "暂停，悬挂", tags: ["CET6"], note: "sus(下)+pend(挂)→挂起→暂停", examples: [
    { en: "They suspended the service.", zh: "他们暂停了服务。" },
    { en: "A lamp was suspended from the ceiling.", zh: "一盏灯从天花板悬挂下来。" },
    { en: "He was suspended from school.", zh: "他被停学了。" } ] },
  { word: "temporary", phonetic: "/ˈtemprəri/", pos: "adj.", meaning: "临时的，暂时的", tags: ["CET4"], note: "temp(时间)→暂时的；反义 permanent", examples: [
    { en: "This is a temporary fix.", zh: "这是个临时的解决办法。" },
    { en: "She found temporary work.", zh: "她找到了临时工作。" },
    { en: "The pain is only temporary.", zh: "疼痛只是暂时的。" } ] },
  { word: "tremendous", phonetic: "/trəˈmendəs/", pos: "adj.", meaning: "巨大的，极好的", tags: ["CET6"], note: "tremendously adv. 极其", examples: [
    { en: "She made tremendous effort.", zh: "她付出了巨大的努力。" },
    { en: "The film was a tremendous success.", zh: "这部电影大获成功。" },
    { en: "There was a tremendous noise.", zh: "响起了一声巨响。" } ] },
  { word: "ultimate", phonetic: "/ˈʌltɪmət/", pos: "adj.", meaning: "最终的，根本的", tags: ["CET6"], note: "ultimately adv. 最终", examples: [
    { en: "Our ultimate goal is peace.", zh: "我们的最终目标是和平。" },
    { en: "This is the ultimate test.", zh: "这是终极考验。" },
    { en: "He took ultimate responsibility.", zh: "他承担了最终责任。" } ] },
  { word: "undermine", phonetic: "/ˌʌndəˈmaɪn/", pos: "v.", meaning: "削弱，暗中破坏", tags: ["GRE"], note: "under(下)+mine(挖)→从底下挖→暗中破坏", examples: [
    { en: "Doubt can undermine trust.", zh: "怀疑会破坏信任。" },
    { en: "Rumors undermined his authority.", zh: "谣言削弱了他的权威。" },
    { en: "Stress undermines your health.", zh: "压力会损害你的健康。" } ] },
  { word: "utilize", phonetic: "/ˈjuːtəlaɪz/", pos: "v.", meaning: "利用", tags: ["CET6"], note: "utility n. 效用；近义 use, employ", examples: [
    { en: "We utilize every resource.", zh: "我们利用每一份资源。" },
    { en: "Utilize your spare time well.", zh: "好好利用你的空闲时间。" },
    { en: "The tool utilizes solar power.", zh: "这个工具利用太阳能。" } ] },
  { word: "valid", phonetic: "/ˈvælɪd/", pos: "adj.", meaning: "有效的，有根据的", tags: ["CET4"], note: "validity n. 有效性；反义 invalid", examples: [
    { en: "That's a valid point.", zh: "那是个有道理的观点。" },
    { en: "The ticket is still valid.", zh: "这张票仍然有效。" },
    { en: "She has a valid reason.", zh: "她有正当的理由。" } ] },
  { word: "vary", phonetic: "/ˈveəri/", pos: "v.", meaning: "变化，不同", tags: ["CET4"], note: "various adj. 各种各样的；variety n. 多样", examples: [
    { en: "Prices vary by season.", zh: "价格随季节变化。" },
    { en: "Opinions vary widely.", zh: "意见分歧很大。" },
    { en: "Results may vary.", zh: "结果可能因人而异。" } ] },
  { word: "vivid", phonetic: "/ˈvɪvɪd/", pos: "adj.", meaning: "生动的，鲜明的", tags: ["CET6"], note: "vividly adv. 生动地", examples: [
    { en: "She has a vivid imagination.", zh: "她想象力丰富生动。" },
    { en: "I have a vivid memory of that day.", zh: "我对那天记忆犹新。" },
    { en: "The painting uses vivid colors.", zh: "这幅画用色鲜艳。" } ] },
  { word: "widespread", phonetic: "/ˈwaɪdspred/", pos: "adj.", meaning: "普遍的，广泛的", tags: ["CET6"], note: "wide(广)+spread(传播)→广泛传播的", examples: [
    { en: "The disease is widespread.", zh: "这种疾病很普遍。" },
    { en: "There is widespread support.", zh: "有广泛的支持。" },
    { en: "The rumor became widespread.", zh: "谣言传得到处都是。" } ] }
];
