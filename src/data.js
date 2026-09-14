export const portfolio = {
  profile: {
    name: '邱潇仪',
    role: 'AI 产品经理',
    statement: '从真实需求和具体场景出发，把复杂的技术变成简单、自然、真正有用的产品体验。',
    /* 首屏四项能力方向标签，改文案只动这里 */
    focus: ['AI产品', '数字化营销产品', '平台产品', '直播产品'],
    introduction: '关注智能办公、AI Agent 与用户体验的交汇点，善于将模糊需求转化为可验证、可协作的产品方案。',
    location: '待补充',
    status: '2027 届',
    politicalStatus: '中共党员',
    photoLabel: '个人照片占位 · 待替换',
  },
  /* 顺序为时间正序：01 本科 → 02 硕士，与「教育背景」页面的版面一致 */
  education: [
    {
      id: 'chongqing-university',
      no: '01',
      school: '重庆大学',
      schoolEn: 'CHONGQING UNIVERSITY',
      level: '本科',
      period: '2019 - 2024',
      tags: ['双一流', '985', '211'],
      logo: './public/assets/logo-chongqing-university.webp',
      photo: './public/assets/education-campus-chongqing.webp',
      photoAlt: '重庆大学主教学楼与校园湖景',
      major: '建筑学',
      detail: 'GPA 3.82/4（2/130）',
      highlights: ['重庆大学优秀毕业生', '建筑设计与研究训练'],
    },
    {
      id: 'tongji-university',
      no: '02',
      school: '同济大学',
      schoolEn: 'TONGJI UNIVERSITY',
      level: '硕士',
      period: '2024 - 2027',
      tags: ['双一流', '985', '211'],
      logo: './public/assets/logo-tongji-university.webp',
      photo: './public/assets/education-campus-tongji.webp',
      photoAlt: '同济大学校园建筑与广场',
      major: '建筑学',
      detail: 'GPA 4.82/5',
      highlights: ['国家奖学金', '国家励志奖学金', '黄乾亨奖学金'],
    },
  ],
  /* 顺序即卡片编号 01→03（时间倒序，最新的在最前），与「工作经历」页面的版面一致。
     short / roleLabel / motto / tags 四项照用户给的版面参考图誊写；台面上的长文案不改动。 */
  experience: [
    {
      id: 'iflytek',
      no: '01',
      organization: '科大讯飞股份有限公司',
      short: '科大讯飞',
      shortEn: '',
      roleLabel: 'AI 产品 / 产品实习生',
      period: '2026.06–09',
      motto: '让每个岗位，都有一个AI搭子',
      tags: ['AI产品', '端侧智能体', '平台产品'],
      logo: './public/assets/logo-iflytek.webp',
      logoPlate: true,
      cover: './public/assets/experience-cover-iflytek.png',
      coverAlt: '科大讯飞办公场景配图（占位色块，待替换）',
      coverPlaceholder: true,
      summary: '参与 AIOS 端侧智能体平台产品迭代，面向政企办公场景扩展 AI 能力生态。',
      highlights: [
        '多智能体协同升级：面向复杂任务协同场景，推动AIOS从一次性Subagent专家团升级为可配置的数字员工群组；打通「任务拆解—DAG动态调度—多Agent协同执行—结果回流」全链路，实现独立任务并行与执行状态全程可追踪。',
        '技能与工具生态建设：围绕办公、创作等核心场景扩展技能供给，技能数量从10+增至400+；重构PPT生成技能兼顾视觉稳定与创作自由；增加read_image工具补齐图像理解能力。',
        'Agent上下文优化：针对私有化部署中小模型上下文容量受限，协同研发开展上下文瘦身；拆解多工具长链路任务并制定验收标准，推动方案通过端到端验证。',
      ],
    },
    {
      id: 'nio',
      no: '02',
      organization: '蔚来软件科技（上海）有限公司',
      short: '蔚来',
      shortEn: 'NIO',
      roleLabel: '订单交付产品 / 产品实习生',
      period: '2025.12–2026.04',
      motto: '聚焦订单与交付，用数字化营销与 AI 提效提升销售转化',
      tags: ['订单与交付', '用户体验', '数据分析'],
      logo: './public/assets/logo-nio.webp',
      logoPlate: true,
      cover: './public/assets/experience-cover-nio.png',
      coverAlt: '蔚来车辆与海边日落配图（占位色块，待替换）',
      coverPlaceholder: true,
      summary: '参与蔚来订单与交付场景的用户端、管理端产品设计，支持 GTM 营销与交付履约。',
      highlights: [
        '车辆配置推荐体系：设计并迭代热门配置推荐模块，通过明星同款、设计师推荐引导用户选配，采纳率2%；设计配置器单项推荐标签提升选装曝光；支持Mate管理平台配置运营。',
        '用户自主预约提车：落地用户自主预约功能，支持B端通过品牌-区域-城市-交付中心多级坑位配置，用户自主预约比例50%，团队人均跟进时长降低65%。',
        '交付跟进AI总结：探索AI在交付业务的应用，设计Mate交付跟进AI总结并参与Prompt调优，自动整合企微群聊与订单信息，定时总结阶段进展与待办事项。',
      ],
    },
    {
      id: 'linjing',
      no: '03',
      organization: '上海邻境网络科技有限公司',
      short: '邻境网络',
      shortEn: '',
      roleLabel: '虚拟直播产品 / 产品实习生',
      period: '2025.06–2025.09',
      motto: '探索虚拟世界的更多可能，让直播与互动更有趣',
      tags: ['虚拟直播', '产品商城', '用户运营'],
      logo: './public/assets/logo-linjing.webp',
      logoPlate: false,
      cover: './public/assets/experience-cover-linjing.png',
      coverAlt: '云镜虚拟直播场景配图（占位色块，待替换）',
      coverPlaceholder: true,
      summary: '负责云镜虚拟直播产品设计，持续优化主播开播体验、直播互动与 AI 素材生成。',
      highlights: [
        '直播体验与互动优化：搭建移动端新手引导系统，梳理主播开播6大核心流程降低上手门槛，日留存率提升8%；迭代礼物特效、活动舞台、分身换装等互动功能。',
        '商城与运营管理：主导Web端商城功能，支持模型定制、直播间调试预约并优化订单流程；搭建折扣管理系统规范虚拟直播商品销售与运营管理。',
        'AI虚拟直播素材生成：基于即梦等AI平台设计Prompt与调优，生成80条5s循环直播动态背景素材；探索用户通过提示词生成定制化动态背景的产品方案。',
      ],
    },
  ],
  /* 「个人作品」两个项目。文案全部来自本人给出的项目描述与版面参考图，
     未补充的内容一律留空（见 demo / link 两字段），不臆造指标。
     mockup 字段决定卡片右侧那屏「产品界面示意」用哪一套结构：
       interview → 视频面试 + 评估面板；scene → 检索 + 影片片段列表。
     demo / link 为空时按钮仍按设计稿排版，点击给出「待补充」提示。 */
  projects: [
    {
      id: 'mock-interview-agent',
      no: '01',
      title: '模拟面试 Agent 产品',
      en: 'Mock Interview Agent',
      tags: ['AI 应用', '教育产品', '大语言模型'],
      summary: '基于 LangGraph 编排简历分析、面试官、评估三个 Agent，实现简历解析、动态追问、分级评估与复盘报告。',
      sceneLabel: '首个落地场景',
      scene: '以产品经理为首个落地场景，为求职者提供针对性模拟面试与能力诊断。',
      points: [
        '用 LangGraph 把「简历分析 / 面试官 / 评估」三个 Agent 串成一条流水线：简历先被解析成结构化画像，面试官据此出题并追问，评估 Agent 再把整场对话汇总成报告。',
        '动态追问：问题跟着回答走，而不是把预设题库从头念到尾。',
        '分级评估与复盘报告：把一场面试拆成可对比的维度，输出能直接拿来改的建议。',
        '首个落地场景选产品经理岗：岗位知识最熟，题目和评分是否靠谱最容易判断。',
      ],
      mockup: 'interview',
      demo: '',
      link: '',
    },
    {
      id: 'scene-words',
      no: '02',
      title: 'Scene Words · 影视英语学习产品',
      en: 'Scene Words',
      tags: ['语言学习', '影视内容', '产品设计'],
      summary: '结合 AI 语义检索与关键词匹配，让用户描述场景即可从影视作品中找到地道英文表达。',
      sceneLabel: '产品验证',
      scene: '以单部影片 1,637 条台词完成产品验证，并已上线。',
      points: [
        '语义检索 + 关键词匹配双路召回：用一句场景描述去搜，不必记得原句，也能落到具体那句台词上。',
        '一个场景对应一段影片片段：表达连同语境一起给，学的不是孤立的句子。',
        '先用单部影片验证：以 1,637 条台词跑通「描述场景 → 找到地道表达」整条链路，再考虑扩片。',
      ],
      mockup: 'scene',
      demo: '',
      link: 'https://joyq1228.github.io/scene-words/',
      cover: './public/assets/projects-scene-words.jpg',
    },
  ],
  /* 「技能」按用户给的版面参考图归成三张大卡：每张含 icon + 标题 + 描述 + 标签；
     卡片下方再放一条黑底「工具列表」(tools)，把常用工具用 · 分隔。 */
  skills: [
    {
      id: 'ai', icon: 'robot', title: 'AI 能力',
      desc: '精通 Claude Code、Codex 等 Vibe Coding 工具，用于方案验证与原型搭建；持续关注 AI 前沿知识。',
      tags: ['Claude Code', 'Codex', 'Agent'],
    },
    {
      id: 'product', icon: 'palette', title: '产品能力',
      desc: '熟练使用 Figma、PS 等产品设计工具；掌握 Excel、Python、SQL 数据处理和分析。',
      tags: ['Figma', 'PS', 'Python', 'SQL'],
    },
    {
      id: 'language', icon: 'globe', title: '语言能力',
      desc: '英语四六级通过，英语能够作为工作语言，口语优秀。',
      tags: ['英语六级', '英语四级'],
    },
  ],
  /* 「爱好」四张卡片(2026-09-12 删了阅读,按用户要求留摄影/旅行/手作/烹饪)。
     tone 决定卡面配色(每张不同,呼应参考图的丰富感);
     photo 留空 → 先渲染同一套线描图标占位;之后把照片路径填进来即自动换成实拍图。
     photos 是"点开这卡后展开的相册"——每类 5 张图(2026-09-12 改 6 → 5,匹配参考图),
     用户之后填路径。 */
  interests: [
    {
      id: 'craft', no: '01', title: '手作', en: 'Handcraft', tone: 'lilac', icon: 'yarn',
      photo: './public/assets/interests-craft-main.jpg', alt: '手作主图（建筑木质模型）', detail: '用双手创造，让灵感变成实物。',
      photos: [
        './public/assets/interests-craft-1.jpg',
        './public/assets/interests-craft-2.jpg',
        './public/assets/interests-craft-3.jpg',
        './public/assets/interests-craft-4.jpg',
        './public/assets/interests-craft-5.jpg',
      ],
    },
    {
      id: 'travel', no: '02', title: '旅行', en: 'Travel', tone: 'sky', icon: 'case',
      photo: './public/assets/interests-travel-main.jpg', alt: '旅行主图（海边人物+桥）', detail: '走向不同的城市，感受多元的文化与风景。',
      photos: [
        './public/assets/interests-travel-1.jpg',
        './public/assets/interests-travel-2.jpg',
        './public/assets/interests-travel-3.jpg',
        './public/assets/interests-travel-4.jpg',
        './public/assets/interests-travel-5.jpg',
      ],
    },
    {
      id: 'photography', no: '03', title: '摄影', en: 'Photography', tone: 'blush', icon: 'camera',
      photo: './public/assets/interests-photography-main.jpg', alt: '摄影主图（藏区白塔 / 古建筑 / 帆船日落）', detail: '记录日常的光与影，发现生活里的小美好。',
      photos: [
        './public/assets/interests-photography-1.jpg',
        './public/assets/interests-photography-2.jpg',
        './public/assets/interests-photography-3.jpg',
        './public/assets/interests-photography-4.jpg',
        './public/assets/interests-photography-5.jpg',
      ],
    },
    {
      id: 'cooking', no: '04', title: '烹饪', en: 'Cooking', tone: 'cream', icon: 'plate',
      photo: './public/assets/interests-cooking-main.jpg', alt: '烹饪主图（蝴蝶酥/千层酥）', detail: '在一餐一饭中，享受创造的快乐。',
      photos: [
        './public/assets/interests-cooking-1.jpg',
        './public/assets/interests-cooking-2.jpg',
        './public/assets/interests-cooking-3.jpg',
        './public/assets/interests-cooking-4.jpg',
        './public/assets/interests-cooking-5.jpg',
      ],
    },
  ],
  /* 「联系我」页：邮箱与手机号是真实值。手机号另给一个带国际区号、
     每 4 位分段的显示串（参考图就是这个格式），实际拨号仍用 phone 原串。
     小红书链接待补 —— 留空时点击卡片是把账号复制到剪贴板，填上 url 就变成外链。 */
  contacts: {
    email: '1300851254@qq.com',
    phone: '15390030352',
    phoneDisplay: '+86 153 9003 0352',
    xiaohongshu: {
      name: 'JOYQ',
      account: '717273417',
      url: '',
    },
  },
  resume: {
    path: './public/assets/resume-qiu-xiaoyi.pdf',
    /* 下载到本地时的文件名：直接取简历原文件名，HR 收到一眼能认出来 */
    fileName: '邱潇仪-同济大学.pdf',
    available: true,
  },
};
