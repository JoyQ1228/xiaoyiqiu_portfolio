import { portfolio } from './data.js';
import { createPetalDescriptors, getActiveSection, getResumeState } from './logic.js';

const app = document.querySelector('#app');

/* 导航项：ready = true 的模块已按设计稿实现；其余保持占位，
   等各自版面定稿后再逐个放开（沿用「一次做一个页面」的节奏）。 */
const navItems = [
  { id: 'about', label: '关于我', ready: true },
  { id: 'education', label: '教育背景', ready: true },
  { id: 'experience', label: '工作经历', ready: true },
  { id: 'projects', label: '个人作品', ready: true },
  { id: 'skills', label: '专业技能', ready: true },
  { id: 'interests', label: '兴趣爱好', ready: true },
  /* 「联系我」从顶栏导航移除(2026-09-12 用户要求):
     联系方式完整保留在页面底部 #contact section,顶栏不再单独占一格。
     之前"技能与爱好"是一个模块,2026-09-12 拆成"专业技能"+"兴趣爱好"两个独立 section
     + 顶栏两个独立 nav 项,每个 module 各自占一屏、各自有自己的标题/英文/寄语。 */
];

const sakuraPetals = createPetalDescriptors(30);
const eduPetals = createPetalDescriptors(9);
const expPetals = createPetalDescriptors(7);
const pjPetals = createPetalDescriptors(8);
const skPetals = createPetalDescriptors(10);
const hbPetals = createPetalDescriptors(8);
const ctPetals = createPetalDescriptors(8);

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

const petalMarkup = (petals) => petals.map((petal) => `<i class="sakura-petal sakura-petal--${petal.depth}" style="--petal-size:${petal.size}px;--petal-duration:${petal.duration}s;--petal-delay:${petal.delay}s;--petal-left:${petal.left}%;--petal-drift:${petal.drift}px;--petal-rotation:${petal.rotation}deg"></i>`).join('');

/* 图标：统一 24×24 网格、1.7 描边，线性风格与教育页/经历页一致 */
const svg = (body, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ${extra}aria-hidden="true">${body}</svg>`;

const ICON_CAP = svg('<path d="M12 3.6 2.4 8.2 12 12.8l9.6-4.6L12 3.6Z"/><path d="M6.2 10.4v4.2c0 1.4 2.6 2.5 5.8 2.5s5.8-1.1 5.8-2.5v-4.2"/><path d="M21.6 8.2v5"/>');
const ICON_CAL = svg('<rect x="3.4" y="5.2" width="17.2" height="15.4" rx="2.6"/><path d="M3.4 9.9h17.2M8.2 3.4v3.4M15.8 3.4v3.4"/>');
const ICON_MAJOR = svg('<path d="M4 4.6h5.6a2.4 2.4 0 0 1 2.4 2.4v12.4a1.9 1.9 0 0 0-1.9-1.9H4V4.6Z"/><path d="M20 4.6h-5.6a2.4 2.4 0 0 0-2.4 2.4v12.4a1.9 1.9 0 0 1 1.9-1.9H20V4.6Z"/>');
const ICON_SCREEN = svg('<rect x="2.8" y="4.4" width="18.4" height="12.8" rx="2.4"/><path d="M8.4 20.6h7.2M12 17.2v3.4"/>');
const ICON_CODE = svg('<path d="M9.2 7.6 4.6 12l4.6 4.4M14.8 7.6 19.4 12l-4.6 4.4"/>');
const ICON_COMPASS = svg('<path d="M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2Z"/><path d="M15.6 8.4 13.7 13.7 8.4 15.6 10.3 10.3Z"/>');
const ICON_LETTER = svg('<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="3.6"/><path d="M9.4 16.4 12.3 8.2l2.9 8.2M10.4 13.8h3.8"/>');
/* 技能区三个新图标(2026-09-12):机器人 / 调色板 / 地球,对应 AI 能力 / 产品能力 / 语言能力 */
const ICON_ROBOT = svg('<rect x="3.4" y="7.4" width="17.2" height="11.6" rx="3"/><path d="M9 11.2h.02M15 11.2h.02M9 15.4h6"/><path d="M12 3.4v4M9 21h6"/>');
const ICON_PALETTE = svg('<path d="M12 3.4a8.6 8.6 0 1 0 0 17.2c1.6 0 1.6-1.4 2.6-1.4h1.6a3 3 0 0 0 3-3v-1.4A8.6 8.6 0 0 0 12 3.4Z"/><circle cx="7.6" cy="9.4" r="1.1"/><circle cx="10.6" cy="6.4" r="1.1"/><circle cx="15" cy="6.4" r="1.1"/><circle cx="17.6" cy="9.4" r="1.1"/>');
const ICON_GLOBE = svg('<circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.6 2.8 4 5.8 4 8.6 0 2.8-1.4 5.8-4 8.6-2.6-2.8-4-5.8-4-8.6 0-2.8 1.4-5.8 4-8.6Z"/>');
const ICON_CAMERA = svg('<rect x="2.8" y="6.8" width="18.4" height="12.6" rx="2.6"/><path d="M8.6 6.8l1.7-2.6h3.4l1.7 2.6"/><circle cx="12" cy="13.1" r="3.5"/>');
const ICON_CASE = svg('<rect x="3" y="7.4" width="18" height="12" rx="2.6"/><path d="M8.6 7.4V5.6a1.8 1.8 0 0 1 1.8-1.8h3.2a1.8 1.8 0 0 1 1.8 1.8v1.8M3 12.8h18M10.6 12.8v1.6h2.8v-1.6"/>');
const ICON_SCISSORS = svg('<path d="M7.2 6.4 17 16.2M16.8 6.4 7 16.2"/><circle cx="6.2" cy="18.8" r="2.4"/><circle cx="17.8" cy="18.8" r="2.4"/>');
const ICON_FILM = svg('<rect x="2.6" y="4.8" width="18.8" height="14.4" rx="2.6"/><path d="M7.4 4.8v14.4M16.6 4.8v14.4M2.6 9.6h4.8M2.6 14.4h4.8M16.6 9.6h4.8M16.6 14.4h4.8"/>');
const ICON_PLATE = svg('<path d="M3.6 11.6h16.8a8.4 8.4 0 0 1-16.8 0Z"/><path d="M9.2 7.6c0-1.3 1.3-1.7 1.3-2.8M13.5 7.6c0-1.3 1.3-1.7 1.3-2.8"/>');
const ICON_BOOK = svg('<path d="M4 4.8h5.6a2.4 2.4 0 0 1 2.4 2.4v12.2a1.9 1.9 0 0 0-1.9-1.9H4V4.8Z"/><path d="M20 4.8h-5.6a2.4 2.4 0 0 0-2.4 2.4v12.2a1.9 1.9 0 0 1 1.9-1.9H20V4.8Z"/>');
const ICON_ARROW_UR = svg('<path d="M7.4 16.6 16.6 7.4M9.6 7.4h7v7"/>');
const ICON_ARROW_R = svg('<path d="M4.6 12h14M13 6.4 18.6 12 13 17.6"/>');
const ICON_ARROW_L = svg('<path d="M19.4 12h-14M11 6.4 5.4 12 11 17.6"/>');
const ICON_PLAY = svg('<path d="M8.6 5.8 18 12l-9.4 6.2Z"/>');
const ICON_LINK = svg('<path d="M10.4 13.6a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.1 1.1"/><path d="M13.6 10.4a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.1-1.1"/>');
const ICON_MIC = svg('<rect x="9.2" y="2.8" width="5.6" height="10.6" rx="2.8"/><path d="M6 11.4a6 6 0 0 0 12 0M12 17.6v3.2"/>');
const ICON_VIDEO = svg('<rect x="2.8" y="6.6" width="12.2" height="10.8" rx="2.6"/><path d="M15 11.2 21.2 8.4v7.2L15 12.8Z"/>');
const ICON_HANGUP = svg('<path d="M3.6 13.4c4.6-4.4 12.2-4.4 16.8 0l-2.7 3.5-3.3-1.4.5-2.5a12.4 12.4 0 0 0-5.8 0l.5 2.5-3.3 1.4Z"/>');
const ICON_SEARCH = svg('<circle cx="10.8" cy="10.8" r="6.2"/><path d="M15.4 15.4 20.6 20.6"/>');
const ICON_SPARK = svg('<path d="M12 3.4 13.7 9.5 19.8 11.2 13.7 12.9 12 19 10.3 12.9 4.2 11.2 10.3 9.5Z"/>');
/* 下载箭头：顶部栏「简历」右侧的记号，一眼看出这个能点着存文件 */
const ICON_DOWNLOAD = svg('<path d="M12 3.8v10.6"/><path d="M7.8 10.6 12 14.8l4.2-4.2"/><path d="M4.8 19.4h14.4"/>');

/* 「联系我」页专用：卡片图标坐在彩色底上，所以用白色实心（fill）而非描边；
   明信片上的笑脸与爱心是手写涂鸦，改回描边更贴近铅笔感。 */
const svgFill = (body, extra = '') => `<svg viewBox="0 0 24 24" fill="currentColor" ${extra}aria-hidden="true">${body}</svg>`;
const ICON_MAIL = svgFill('<path fill-rule="evenodd" d="M4.9 4.3h14.2c1.7 0 3 1.4 3 3v9.4c0 1.7-1.3 3-3 3H4.9c-1.7 0-3-1.3-3-3V7.3c0-1.6 1.3-3 3-3Zm.6 3 6.5 4.3 6.5-4.3H5.5Z"/>');
const ICON_PHONE = svgFill('<path d="M7 3.3c-1.2 0-2.2 1-2.2 2.2 0 8.6 5.5 14.1 14.1 14.1 1.2 0 2.2-1 2.2-2.2v-2.7c0-1-.6-1.8-1.6-2l-3.2-.8c-.8-.2-1.6.1-2.1.7l-1.4 1.5a13.4 13.4 0 0 1-4.3-4.3L10 8.4c.5-.6.7-1.4.5-2.1l-.8-3.2c-.2-1-1.1-1.6-2-1.6H7Z"/>');
const ICON_XHS = svgFill('<path d="M3.4 5.9c2.7-1.1 5.4-1 7.5.6v12.7c-2.1-1.6-4.8-1.7-7.5-.6V5.9Z"/><path d="M20.6 5.9c-2.7-1.1-5.4-1-7.5.6v12.7c2.1-1.6 4.8-1.7 7.5-.6V5.9Z"/>');
const ICON_HEART = svg('<path d="M12.2 20.1c-1.1-.8-8.1-5.5-8.1-11a4.3 4.3 0 0 1 8-2.4 4.3 4.3 0 0 1 8 2.4c0 5.5-7 10.2-7.9 11Z"/>', 'stroke-width="1.5" ');
/* 联系方式卡 hover 时露出的复制按钮:两个方块重叠 */
const ICON_COPY = svg('<rect x="8" y="8" width="12" height="12" rx="2.4"/><path d="M16 8V5.2A2.2 2.2 0 0 0 13.8 3H5.2A2.2 2.2 0 0 0 3 5.2v8.6A2.2 2.2 0 0 0 5.2 16h2.8"/>');
const ICON_SMILE = svg('<path d="M7.4 12.4c1.5 2.9 7.7 2.9 9.2 0"/><path d="M8.9 9.2h.02M15.1 9.2h.02"/>', 'stroke-width="1.9" ');

const SKILL_ICONS = { screen: ICON_SCREEN, code: ICON_CODE, compass: ICON_COMPASS, letter: ICON_LETTER, robot: ICON_ROBOT, palette: ICON_PALETTE, globe: ICON_GLOBE };
const HOBBY_ICONS = { camera: ICON_CAMERA, case: ICON_CASE, yarn: ICON_SCISSORS, plate: ICON_PLATE, book: ICON_BOOK };

/* 首屏自我陈述：在第一个逗号处断行（逗号前的半句独立成行），
   这样 650px 的版心上稳定落在两行，不会因为换文案就折成三行或一行半 */
function statementMarkup(text) {
  const at = text.indexOf('，');
  if (at < 0 || at > text.length - 6) return escapeHtml(text);
  return `${escapeHtml(text.slice(0, at + 1))}<br>${escapeHtml(text.slice(at + 1))}`;
}

function navMarkup() {
  return navItems.map(({ id, label, ready }) => (ready
    ? `<a href="#${id}" data-nav="${id}">${label}</a>`
    : `<button class="nav-pending" type="button" disabled aria-disabled="true" title="版面设计中">${label}</button>`)).join('');
}

function eduMeta(icon, label, value) {
  return `<li>${icon}<span class="edu-label">${label}</span><strong>${escapeHtml(value)}</strong></li>`;
}

/* 竖版信息卡（2026-09-12 改版）：上半张校园照，下半「序号 + 校名 + 三项信息 + 标签」。
   第三轮按用户要求去掉了卡片右下角的校徽 logo。
   卡内一切尺寸都写成 --u 的倍数，卡片宽度一变整块等比缩放，见 styles.css 的 .edu-card。 */
function eduCard(item) {
  return `
      <div class="edu-slot">
      <article class="edu-card" data-edu="${escapeHtml(item.id)}">
        <figure class="edu-media">
          <span class="edu-photo-clip"><img class="edu-photo" src="${item.photo}" alt="${escapeHtml(item.photoAlt)}" width="1200" height="848" loading="lazy" decoding="async"></span>
        </figure>
        <div class="edu-head">
          <p class="edu-no" aria-hidden="true">${item.no}</p>
          <div class="edu-name">
            <h3>${escapeHtml(item.school)}</h3>
            <p class="edu-en-name">${escapeHtml(item.schoolEn)}</p>
          </div>
        </div>
        <ul class="edu-meta">
          ${eduMeta(ICON_CAP, '学历层次', item.level)}
          ${eduMeta(ICON_MAJOR, '就读专业', item.major)}
          ${eduMeta(ICON_CAL, '就读时间', item.period)}
        </ul>
        <p class="edu-tags"><i aria-hidden="true"></i>${item.tags.map((tag) => escapeHtml(tag)).join(' · ')}</p>
      </article>
      </div>`;
}

/* 工作经历卡片：配图在上、文案在下。三张卡默认呈扇形插在文件夹口袋里，
   「中间那张」由 JS 依据当前居中项动态指派（class 为 is-center / is-left / is-right）。 */
function expCard(item, index) {
  const ICON_ARROW_CURVE = '<svg viewBox="0 0 32 24" width="22" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12 C 10 12, 14 5, 20 5 L 28 5 M 24 1 L 28 5 L 24 9"/></svg>';
  const ICON_CAL_S = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>';
  return `
      <article class="exp-card" data-index="${index}" data-exp="${escapeHtml(item.id)}" role="button" tabindex="0" aria-pressed="false" aria-label="查看${escapeHtml(item.short)}的实习详情">
        <div class="exp-card__inner">
          <div class="exp-card__face exp-card__face--front">
            <span class="exp-no" aria-hidden="true">${item.no}</span>
            <span class="exp-card__media">
              <img class="exp-cover" src="${item.cover}" alt="${escapeHtml(item.coverAlt)}" width="1040" height="712" loading="lazy" decoding="async">
              <span class="exp-media__shade" aria-hidden="true"></span>
              <span class="exp-media__period">${ICON_CAL_S}<em>${escapeHtml(item.period)}</em></span>
            </span>
            <div class="exp-card__body">
              <header class="exp-card__head">
                <span class="exp-tile${item.logoPlate ? ' exp-tile--plate' : ''}"><img class="exp-tile__img" src="${item.logo}" alt="" width="320" height="320" loading="lazy" decoding="async"></span>
                <span class="exp-card__names">
                  <strong class="exp-card__name">${escapeHtml(item.short)}${item.shortEn ? `<span class="exp-card__en">${escapeHtml(item.shortEn)}</span>` : ''}</strong>
                  <em class="exp-card__role">${escapeHtml(item.roleLabel)}</em>
                </span>
                <span class="exp-card__hint" aria-hidden="true">${ICON_ARROW_CURVE}</span>
              </header>
              <p class="exp-motto">${escapeHtml(item.motto)}</p>
              <ul class="exp-tags">${item.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>
            </div>
          </div>
          <div class="exp-card__face exp-card__face--back" aria-hidden="true">
            <header class="exp-back__head">
              <span class="exp-tile exp-tile--plate"><img class="exp-tile__img" src="${item.logo}" alt="" width="320" height="320" loading="lazy" decoding="async"></span>
              <span class="exp-back__title">
                <strong class="exp-back__name">${escapeHtml(item.short)}${item.shortEn ? `<span class="exp-back__en">${escapeHtml(item.shortEn)}</span>` : ''}</strong>
                <em class="exp-back__role">${escapeHtml(item.roleLabel)}</em>
              </span>
            </header>
            <h4 class="exp-back__subtitle">主要工作</h4>
            <ol class="exp-back__list">${item.highlights.map((line, i) => `<li><span class="exp-back__num">0${i + 1}</span><span class="exp-back__text">${escapeHtml(line)}</span></li>`).join('')}</ol>
            <span class="exp-card__hint exp-card__hint--back" aria-hidden="true">${ICON_ARROW_CURVE}</span>
          </div>
        </div>
      </article>`;
}

/* ===== 个人作品：右侧那屏「产品界面示意」 =====
   项目还没有真实截图时，用 DOM+CSS 搭一屏等比缩小的界面示意（item.mockup 决定哪套）；
   项目已经有真实截图时，给 item.cover 传图片路径，直接用 <img> 渲染，DOM mockup 整体被替换。 */
const WAVE_BARS = [32, 58, 84, 46, 96, 62, 36, 74, 52, 90, 42, 66, 88, 48, 72, 56, 94, 40, 62, 80, 46, 34];

function pjMockup(item) {
  /* 已有真截图时直接渲染图片,不再拼 DOM mockup —— 整块 .pj-mock 让位给真图 */
  if (item.cover) {
    return `
      <div class="pj-mock pj-mock--cover" aria-hidden="true">
        <img class="pj-cover" src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)} 截图" loading="lazy" decoding="async">
      </div>`;
  }
  if (item.mockup === 'scene') {
    const clips = [
      { film: 'Titanic', note: '你跳，我也跳' },
      { film: 'La La Land', note: '献给追梦的人' },
      { film: 'Forrest Gump', note: '生活就像一盒巧克力' },
    ];
    return `
      <div class="pj-mock pj-mock--scene" aria-hidden="true">
        <div class="pj-win">
          <header class="pj-win__bar">
            <span class="pj-win__logo"></span>
            <span class="pj-win__name">Scene Words</span>
            <span class="pj-win__tabs"><i>发现</i><i>经典台词</i><i>我的收藏</i></span>
          </header>
          <p class="pj-search">${ICON_SEARCH}<span>描述场景，找到地道表达</span><i class="pj-search__go"></i></p>
          <div class="pj-scene">
            <div class="pj-still">
              <span class="pj-still__mark">${ICON_FILM}</span>
              <span class="pj-still__sub"><b>“You jump, I jump.”</b><em>你跳，我也跳。</em></span>
            </div>
            <div class="pj-clips">
              <p class="pj-clips__title">相关片段</p>
              <ul>${clips.map((clip) => `<li><span class="pj-clips__thumb"></span><b>${clip.film}</b><em>${clip.note}</em></li>`).join('')}</ul>
            </div>
          </div>
        </div>
      </div>`;
  }
  const scores = [
    { label: '沟通能力', value: 88 },
    { label: '逻辑思维', value: 82 },
    { label: '岗位匹配', value: 78 },
    { label: '综合表现', value: 85 },
  ];
  return `
      <div class="pj-mock pj-mock--interview" aria-hidden="true">
        <div class="pj-win">
          <header class="pj-win__bar">
            <span class="pj-win__logo pj-win__logo--live"></span>
            <span class="pj-win__name">模拟面试</span>
            <span class="pj-win__state">面试中 ···</span>
            <span class="pj-win__time">03:24</span>
          </header>
          <div class="pj-call">
            <div class="pj-call__stage">
              <span class="pj-call__face"></span>
              <span class="pj-call__wave">${WAVE_BARS.map((height) => `<i style="--h:${height}%"></i>`).join('')}</span>
              <span class="pj-call__ctrl">
                <i>${ICON_MIC}</i><i>${ICON_VIDEO}</i><i class="pj-call__ctrl--end">${ICON_HANGUP}</i>
              </span>
            </div>
            <div class="pj-eval">
              <header class="pj-eval__head"><span>面试评估</span>${ICON_ARROW_UR}</header>
              <div class="pj-eval__top">
                <span class="pj-ring">
                  <svg viewBox="0 0 40 40" aria-hidden="true">
                    <defs><linearGradient id="pj-ring-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8f7bf0"/><stop offset="1" stop-color="#c9aef8"/></linearGradient></defs>
                    <circle cx="20" cy="20" r="16.5" fill="none" stroke="#ece7fb" stroke-width="4.4"/>
                    <circle cx="20" cy="20" r="16.5" fill="none" stroke="url(#pj-ring-grad)" stroke-width="4.4" stroke-linecap="round" stroke-dasharray="88.1 103.7" transform="rotate(-90 20 20)"/>
                  </svg>
                  <b>85</b>
                </span>
                <span class="pj-eval__label">表现良好</span>
              </div>
              <ul class="pj-bars">
                ${scores.map((score) => `<li><span>${score.label}</span><i style="--v:${score.value}%"></i><b>${score.value}</b></li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>`;
}

/* 一行项目：左侧序号条 + 文案栏（标题/标签/简介/按钮），右侧一整屏界面示意 */
function pjRow(item) {
  const pending = (kind) => (item[kind] ? '' : ' data-pj-pending="' + (kind === 'demo' ? '演示动图' : '项目链接') + '"');
  return `
      <article class="pj-row" data-pj="${escapeHtml(item.id)}">
        <span class="pj-row__no" aria-hidden="true">${item.no}</span>
        <div class="pj-row__text">
          <header class="pj-row__head">
            <h3 class="pj-row__title">${escapeHtml(item.title)}</h3>
            <p class="pj-row__en">${escapeHtml(item.en)}</p>
          </header>
          <ul class="pj-tags">${item.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>
          <p class="pj-row__desc">${escapeHtml(item.summary)}</p>
          <div class="pj-actions">
            <a class="pj-btn" href="${item.link || '#'}"${pending('link')}>${ICON_LINK}项目链接</a>
            <button class="pj-more" type="button" data-pj-more data-pj-target="${escapeHtml(item.id)}">展开详情${ICON_ARROW_R}</button>
          </div>
        </div>
        ${pjMockup(item)}
      </article>`;
}

/* 技能大卡(2026-09-12 新版):icon + 标题 + 描述 + 标签,
   参考用户给的版面布局(3 张大卡片并排,每张含彩色 icon 块、加粗黑色标题、
   深灰描述、底部黑色细边圆角椭圆 tag) */
function skCard(item) {
  return `
      <article class="sk-card">
        <span class="sk-card__ico" aria-hidden="true">${SKILL_ICONS[item.icon] || ICON_SCREEN}</span>
        <h3 class="sk-card__title">${escapeHtml(item.title)}</h3>
        <p class="sk-card__desc">${escapeHtml(item.desc)}</p>
        <ul class="sk-card__tags">${item.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>
      </article>`;
}

/* 爱好卡片：photo 留空时用线描图标占位；tone 决定卡面配色。
   2026-09-12:删了原来的 .hb-card__go 右上角圆箭头按钮(用户觉得"没设计感"),
   整张卡片变成可点入口:点击触发 .hb-gallery 展开,展示该类爱好的 6 张图。 */
function hbCard(item, index) {
  const media = item.photo
    ? `<img class="hb-card__photo" src="${item.photo}" alt="${escapeHtml(item.alt)}" width="720" height="900" loading="lazy" decoding="async">`
    : `<span class="hb-card__icon">${HOBBY_ICONS[item.icon] || ICON_CAMERA}</span>`;
  return `
      <article class="hb-card hb-card--${item.tone}" data-index="${index}" data-hb="${escapeHtml(item.id)}" role="button" tabindex="0" aria-pressed="false" aria-label="查看${escapeHtml(item.title)}的作品集（共 ${item.photos.length} 张）">
        <span class="hb-card__media">
          ${media}
        </span>
        <div class="hb-card__body">
          <strong class="hb-card__name">${escapeHtml(item.title)}<em>${escapeHtml(item.en)}</em></strong>
          <p class="hb-card__detail">${escapeHtml(item.detail)}</p>
        </div>
      </article>`;
}

/* ===== 联系我：左侧联系方式卡 + 右侧明信片 =====
   明信片整块是 DOM + 内联 SVG 画的（齿孔、邮戳波浪、落日与天际线都不依赖图片），
   将来要换成实拍照片，只替换 .ct-stamp__art 里那两块 <rect fill="url(#ct-stamp-sky)"> 与天际线即可。 */
const stampHoles = () => {
  const holes = [];
  for (let x = 5; x <= 99; x += 10) { holes.push(`<circle cx="${x}" cy="4.6" r="3.6"/>`); holes.push(`<circle cx="${x}" cy="123.4" r="3.6"/>`); }
  for (let y = 5; y <= 123; y += 10) { holes.push(`<circle cx="4.6" cy="${y}" r="3.6"/>`); holes.push(`<circle cx="99.4" cy="${y}" r="3.6"/>`); }
  return holes.join('');
};

const ctStampShapes = () => `
            <defs>
              <mask id="ct-stamp-mask">
                <rect width="104" height="128" fill="#fff"/>
                <g fill="#000">${stampHoles()}</g>
              </mask>
              <linearGradient id="ct-stamp-sky" x1="0" y1="0" x2="0.35" y2="1">
                <stop offset="0" stop-color="#a892e2"/>
                <stop offset="42%" stop-color="#e3a6cd"/>
                <stop offset="76%" stop-color="#f6c9a8"/>
                <stop offset="1" stop-color="#fbe0c4"/>
              </linearGradient>
              <radialGradient id="ct-stamp-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stop-color="#fff8e8" stop-opacity=".95"/>
                <stop offset="1" stop-color="#fff8e8" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <rect width="104" height="128" fill="#fff" mask="url(#ct-stamp-mask)"/>
            <rect x="11" y="15" width="82" height="98" fill="url(#ct-stamp-sky)"/>
            <circle cx="66" cy="72" r="18" fill="url(#ct-stamp-glow)"/>
            <circle cx="66" cy="72" r="7.4" fill="#fff6e0" opacity=".92"/>
            <path d="M11 113V98h6v-9h5v9h4v-15h6v15h5v-7h5v7h4v-12h6v12h5v-5h6v5h4v-10h6v10h4v-8h5v8h5v15Z" fill="#63528d" opacity=".66"/>`;

function ctStamp() {
  return `
        <span class="ct-stamp" aria-hidden="true">
          <svg class="ct-stamp__art" viewBox="0 0 104 128" focusable="false">
            ${ctStampShapes()}
          </svg>
        </span>`;
}

function ctPostmark() {
  return `
        <svg class="ct-postmark" viewBox="0 0 152 96" aria-hidden="true" focusable="false">
          <g fill="none" stroke="currentColor" stroke-linecap="round">
            <circle cx="58" cy="48" r="31" stroke-width="1.5" opacity=".46"/>
            <circle cx="58" cy="48" r="25.4" stroke-width=".9" opacity=".3"/>
            <path d="M94 27c5.6-5.6 11.2-5.6 16.8 0s11.2 5.6 16.8 0 11.2-5.6 16.8 0" stroke-width="1.3" opacity=".36"/>
            <path d="M94 48c5.6-5.6 11.2-5.6 16.8 0s11.2 5.6 16.8 0 11.2-5.6 16.8 0" stroke-width="1.3" opacity=".36"/>
            <path d="M94 69c5.6-5.6 11.2-5.6 16.8 0s11.2 5.6 16.8 0 11.2-5.6 16.8 0" stroke-width="1.3" opacity=".36"/>
          </g>
          <g fill="currentColor" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-weight="700" letter-spacing="1">
            <text x="58" y="44.5" font-size="7.6" opacity=".6">GOOD</text>
            <text x="58" y="54" font-size="7.6" opacity=".6">IDEAS</text>
            <text x="58" y="63.5" font-size="5.8" letter-spacing="1.5" opacity=".48">GO FURTHER</text>
          </g>
        </svg>`;
}

function ctPostcard() {
  return `
        <article class="ct-postcard">
          <span class="ct-postcard__kicker"><em>POSTCARD</em><i>FOR A BRIGHTER TOMORROW</i></span>
          <p class="ct-note">期待与你交流，<br>一起发现更多可能。<span class="ct-note__heart" aria-hidden="true">${ICON_HEART}</span></p>
          <span class="ct-sign-line" aria-hidden="true"></span>
          <p class="ct-sign">— Qiu Xiaoyi</p>
          ${ctStamp()}
          <p class="ct-postcard__foot">SAME SKY,<br>BRIGHTER DAYS<br>TOGETHER</p>
        </article>`;
}

/* 联系方式卡(2026-09-13):卡片本身不再做主操作(<a> / <button>),
   hover 卡片时在右侧露出一个"复制"小按钮,点了把账号 / 手机 / 邮箱拷到剪贴板。
   之前小红书无 href 时是退化 button,现在三个都统一行为:显示账号 + 复制。 */
function ctCard({ tone, icon, en, label, value, copy, copyLabel }) {
  const inner = `
            <span class="ct-card__ico">${icon}</span>
            <span class="ct-card__body">
              <em class="ct-card__label">${escapeHtml(label)}<i aria-hidden="true">${escapeHtml(en)}</i></em>
              <strong class="ct-card__value">${escapeHtml(value)}</strong>
            </span>`;
  return `
          <li class="ct-item">
            <div class="ct-card ct-card--${tone}" data-ct-tone="${tone}" data-ct-value="${escapeHtml(copy || value)}">
              ${inner}
              <button class="ct-card__copy" type="button" data-ct-copy-trigger aria-label="${escapeHtml(copyLabel || '复制')}">
                ${ICON_COPY}<span class="ct-card__copy-tip" aria-hidden="true">复制</span>
              </button>
            </div>
          </li>`;
}

function ctList(contacts) {
  const xhs = contacts.xiaohongshu;
  return [
    ctCard({ tone: 'mail', icon: ICON_MAIL, en: 'MAIL', label: '邮箱', value: contacts.email, copy: contacts.email, copyLabel: '复制邮箱' }),
    ctCard({ tone: 'phone', icon: ICON_PHONE, en: 'PHONE', label: '手机号', value: contacts.phoneDisplay || contacts.phone, copy: contacts.phone, copyLabel: '复制手机号' }),
    ctCard({ tone: 'xhs', icon: ICON_XHS, en: 'RED', label: '小红书', value: `${xhs.name} · ${xhs.account}`, copy: xhs.account, copyLabel: '复制小红书账号' }),
  ].join('');
}
/* 详情弹窗：经历页与作品页共用同一个实例（只看内容，故不重复渲染两份 DOM） */
function modalMarkup() {
  return `
    <div class="ui-modal" data-modal hidden>
      <div class="ui-modal__scrim" data-modal-close></div>
      <div class="ui-modal__panel" role="dialog" aria-modal="true" aria-labelledby="ui-modal-title" tabindex="-1">
        <button class="ui-modal__close" type="button" data-modal-close aria-label="关闭详情">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <div class="ui-modal__body" data-modal-body></div>
      </div>
    </div>`;
}

function render() {
  const { profile, education, experience, projects, skills, interests, contacts, resume } = portfolio;
  const resumeState = getResumeState(resume);
  app.innerHTML = `
    <header class="site-header">
      <a class="wordmark" href="#about" aria-label="返回首页">PORTFOLIO</a>
      <button class="menu-toggle" aria-expanded="false" aria-controls="primary-nav">目录</button>
      <nav id="primary-nav" class="primary-nav" aria-label="页面导航">${navMarkup()}</nav>
      ${resumeState.available ? `<a class="resume-download" href="${resumeState.href}" download="${escapeHtml(resumeState.fileName)}" title="下载简历 PDF（${escapeHtml(resumeState.fileName)}）" aria-label="下载简历 PDF">
        <span class="resume-download__text">简历</span>
        <span class="resume-download__ico" aria-hidden="true">${ICON_DOWNLOAD}</span>
      </a>` : `<p class="resume-unavailable" role="status">${resumeState.label}</p>`}
    </header>
    <main>
      <section id="about" class="hero section-anchor" aria-labelledby="hero-title">
        <div class="sakura-field" aria-hidden="true">
          ${petalMarkup(sakuraPetals)}
        </div>
        <div class="hero-copy">
          <h1 id="hero-title"><span class="hero-hi">Hi,</span>我是${escapeHtml(profile.name)}</h1>
          <p class="hero-role">Product Manager / 产品经理</p>
          <p class="statement">${statementMarkup(profile.statement)}</p>
          <div class="hero-tags" aria-label="能力方向">${profile.focus.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
          <div class="hero-links">
            ${resumeState.available ? `<a class="hero-button hero-button--primary" href="${resumeState.href}" download="${escapeHtml(resumeState.fileName)}">下载简历</a>` : ''}
            <a class="hero-button hero-button--secondary" href="#contact">联系我</a>
          </div>
        </div>
        <div class="portrait-wrap">
          <picture class="portrait-frame">
            <source srcset="./public/assets/qiu-xiaoyi-portrait.webp" type="image/webp">
            <img class="portrait-photo" src="./public/assets/qiu-xiaoyi-portrait.png" alt="邱潇仪手捧樱花的个人照片" width="1000" height="1620" decoding="async">
          </picture>
        </div>
      </section>

      <section id="education" class="edu section-anchor" aria-labelledby="education-title">
        <div class="sakura-field edu-petals" aria-hidden="true">${petalMarkup(eduPetals)}</div>
        <div class="edu-inner">
          <header class="edu-intro">
            <h2 id="education-title">教育背景</h2>
            <p class="edu-en">Education</p>
            <p class="edu-lead">保持热爱，持续学习，<br>在更广阔的世界里，成为更好的自己。</p>
          </header>
          <div class="edu-stage">
            ${education.map((item) => eduCard(item)).join('')}
          </div>
        </div>
      </section>

      <section id="experience" class="exp section-anchor" aria-labelledby="experience-title">
        <div class="sakura-field exp-petals" aria-hidden="true">${petalMarkup(expPetals)}</div>
        <div class="exp-inner">
          <header class="exp-intro">
            <h2 id="experience-title">工作经历</h2>
            <p class="exp-en">Work Experience</p>
            <p class="exp-lead">在不同的团队中，体验多元的产品场景，<br>也在一次次实践中，更靠近我想成为的自己。</p>
          </header>
          <div class="exp-stage" data-exp-stage>
            <div class="exp-folder">
              <span class="exp-folder__back" aria-hidden="true"></span>
              <div class="exp-fan" data-exp-fan>
                ${experience.map((item, index) => expCard(item, index)).join('')}
              </div>
              <span class="exp-folder__pocket" aria-hidden="true">
                <!-- 袋口弧线：两端停在袋身上沿内侧 48%、中间再下凹约 8%（viewBox 高 200）。
                     弧线最低点（y=112）在文件夹高度 56% 处 —— 卡片底边就是沉到这条线
                     以下被盖住的，所以这个 y 值同时决定了「卡片插多深」。
                     两端别抬太高：左右两张卡是斜的，外侧下角本来就低 20px 上下，
                     弧线再往上抬就会把它们最外侧的那颗标签一起切掉。 -->
                <svg class="exp-pocket-shape" viewBox="0 0 1000 200" preserveAspectRatio="none" focusable="false" aria-hidden="true">
                  <defs>
                    <linearGradient id="exp-pocket-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stop-color="#f8f5ff"/>
                      <stop offset="55%" stop-color="#f2edfe"/>
                      <stop offset="1" stop-color="#ebe5fd"/>
                    </linearGradient>
                  </defs>
                  <path d="M0 96 C 150 96 265 112 500 112 C 735 112 850 96 1000 96 L1000 200 L0 200 Z" fill="url(#exp-pocket-fill)"/>
                  <path d="M0 96 C 150 96 265 112 500 112 C 735 112 850 96 1000 96" fill="none" stroke="rgba(255,255,255,.92)" stroke-width="2" vector-effect="non-scaling-stroke"/>
                </svg>
                <span class="exp-pocket-mark"><i></i><em>Three internship<br>experiences</em></span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" class="pj section-anchor" aria-labelledby="projects-title">
        <div class="sakura-field pj-petals" aria-hidden="true">${petalMarkup(pjPetals)}</div>
        <div class="pj-inner">
          <header class="pj-intro">
            <h2 id="projects-title">个人作品</h2>
            <p class="pj-en">Selected Projects</p>
            <p class="pj-lead">把想法变成可体验的产品，<br>用设计和技术，让学习与成长更有趣。</p>
          </header>
          <div class="pj-stage" data-pj-stage>
            ${projects.map((item) => pjRow(item)).join('')}
          </div>
        </div>
      </section>

      <section id="skills" class="sk section-anchor" aria-labelledby="skills-title">
        <div class="sakura-field sk-petals" aria-hidden="true">${petalMarkup(skPetals)}</div>
        <div class="sk-inner">
          <header class="sk-intro">
            <h2 id="skills-title">专业技能</h2>
            <p class="sk-en">Professional Skills</p>
            <p class="sk-lead">用工具放大能力，用方法沉淀经验，<br>让每一次产品决策都更扎实、更可复用。</p>
          </header>
          <div class="sk-skills">
            <div class="sk-cards">${skills.map((item) => skCard(item)).join('')}</div>
          </div>
        </div>
      </section>

      <section id="interests" class="hb section-anchor" aria-labelledby="interests-title">
        <div class="sakura-field hb-petals" aria-hidden="true">${petalMarkup(hbPetals)}</div>
        <div class="hb-inner">
          <header class="hb-intro">
            <h2 id="interests-title">兴趣爱好</h2>
            <p class="hb-en">Interests</p>
            <p class="hb-lead">热爱让生活更丰富，<br>也让设计拥有更多的灵感、观察与温度。</p>
          </header>
          <div class="hb-fan-wrap">
            <div class="hb-fan" data-hb-fan>${interests.map((item, index) => hbCard(item, index)).join('')}</div>
          </div>
        </div>
      </section>
      <!-- 画廊展开层(2026-09-12 重做 2026-09-12 fix 关键修复:把 .hb-mask 和 .hb-gallery
           移到 .hb section 外,做 .app 的直接子元素 —— 之前它们在 .hb 内部,
           而 .hb 有 isolation:isolate 会创建新 stacking context,gallery 的 z-index:81
           只在 .hb 内部生效,跟 .site-header(z-index:10,document 层面)比,实际被 header
           盖在背后 → 用户感觉"点了没反应",其实画廊已经在背后打开了。):点任一 hb-card 触发,
             浅灰蒙层 + 6 张图循环轮播(中间 1 张正 + 左右各 1 张倾斜,2:3 宽高比,参考图样式) +
             左右切换按钮(无组号,循环切换) + 右上 ✕。点蒙层空白或 ✕ 关闭。 -->
        <div class="hb-mask" data-hb-mask hidden aria-hidden="true"></div>
        <div class="hb-gallery" data-hb-gallery hidden role="dialog" aria-modal="true" aria-labelledby="hb-gallery-title">
          <div class="hb-gallery__inner">
            <button class="hb-close" type="button" data-hb-close aria-label="关闭作品集">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
            <header class="hb-gallery__head">
              <h3 id="hb-gallery-title" class="hb-gallery__title"></h3>
              <p class="hb-gallery__sub"></p>
            </header>
            <div class="hb-gallery__stage">
              <ol class="hb-photo-list" data-hb-photo-list></ol>
            </div>
            <nav class="hb-gallery__nav" aria-label="切换图片">
              <button class="hb-nav" type="button" data-hb-prev-photo aria-label="上一张">${ICON_ARROW_L}</button>
              <button class="hb-nav hb-nav--next" type="button" data-hb-next-photo aria-label="下一张">${ICON_ARROW_R}</button>
            </nav>
          </div>
        </div>

      <section id="contact" class="ct section-anchor" aria-labelledby="contact-title">
        <div class="sakura-field ct-petals" aria-hidden="true">${petalMarkup(ctPetals)}</div>
        <div class="ct-inner">
          <div class="ct-left">
            <header class="ct-intro">
              <h2 id="contact-title">联系我</h2>
              <p class="ct-en">Let&rsquo;s Connect</p>
              <p class="ct-lead">很期待和你交流！<br>无论是工作机会、学习交流、项目合作，<br>还是有趣的想法，都欢迎随时联系我。</p>
            </header>
            <ul class="ct-list">${ctList(contacts)}</ul>
          </div>
          <div class="ct-stage">
            <span class="ct-postcard-under" aria-hidden="true"></span>
            ${ctPostcard()}
          </div>
        </div>
      </section>
    </main>
    ${modalMarkup()}
    <p class="site-toast" data-site-toast hidden role="status"></p>`;
}

/* ===== 站点级提示条：作品页的「链接待补」与联系页的「已复制」共用同一个节点 ===== */
let toastTimer = null;
function showToast(message) {
  const toast = document.querySelector('[data-site-toast]');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('is-on'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-on');
    setTimeout(() => { toast.hidden = true; }, 240);
  }, 2600);
}

/* ===== 共用弹窗：居中面板 + 灰色遮罩 + 滚动锁 ===== */
function createModal() {
  const modal = document.querySelector('[data-modal]');
  const body = modal?.querySelector('[data-modal-body]');
  const panel = modal?.querySelector('.ui-modal__panel');
  let lastFocused = null;

  const onKeydown = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab' || !panel) return;
    const focusables = [...panel.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.disabled && element.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  function close() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown);
    document.documentElement.classList.remove('is-modal-open');
    document.documentElement.style.paddingRight = '';
    const finish = () => { modal.hidden = true; };
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) finish();
    else setTimeout(finish, 240);
    lastFocused?.focus?.();
  }

  const open = (html) => {
    if (!modal || !body) return;
    lastFocused = document.activeElement;
    body.innerHTML = html;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    /* 锁滚动的同时补回滚动条宽度，避免整页内容左右跳一下 */
    const gap = window.innerWidth - document.documentElement.clientWidth;
    if (gap > 0) document.documentElement.style.paddingRight = `${gap}px`;
    document.documentElement.classList.add('is-modal-open');
    document.addEventListener('keydown', onKeydown);
    panel?.focus();
  };

  modal?.querySelectorAll('[data-modal-close]').forEach((node) => node.addEventListener('click', close));
  return { open, close };
}

/* ===== 工作经历：三卡扇形切换 + 居中详情弹窗 ===== */
function initExperience(ui) {
  const stage = document.querySelector('[data-exp-stage]');
  const fan = document.querySelector('[data-exp-fan]');
  if (!stage || !fan) return;

  const cards = [...fan.querySelectorAll('.exp-card')];
  const count = cards.length;
  /* 默认三项都插在文件夹里（.exp-card 不带 .is-active 就是插入态），
     中间那张只是位置居中、并没有抽出来 —— 呼应「单击才会出来」。
     -1 表示「还没有哪张被抽出来」。 */
  let center = Math.min(1, count - 1);
  let active = -1;
  /* 翻面状态：哪张卡被翻到背面。-1 = 都没翻。
     桌面端：active 卡翻面显示详细工作；窄屏由 CSS 禁掉翻面,直接走模态。 */
  let flipped = -1;

  const layout = () => {
    cards.forEach((card, index) => {
      const slot = (index - center + count) % count; /* 0 中 · 1 右 · 2 左 */
      card.classList.toggle('is-center', slot === 0);
      card.classList.toggle('is-right', slot === 1);
      card.classList.toggle('is-left', slot === 2);
      card.classList.toggle('is-active', index === active);
      card.classList.toggle('is-flipped', index === flipped);
      card.setAttribute('aria-pressed', String(index === active));
    });
  };

  const fillModal = (item) => ui.open(`
      <header class="ui-modal__head">
        <span class="exp-tile${item.logoPlate ? ' exp-tile--plate' : ''}"><img class="exp-tile__img" src="${item.logo}" alt="" width="320" height="320" decoding="async"></span>
        <span class="ui-modal__names">
          <h3 id="ui-modal-title">${escapeHtml(item.organization)}</h3>
          <p class="ui-modal__role">${escapeHtml(item.roleLabel)}</p>
        </span>
      </header>
      <p class="ui-modal__period">${ICON_CAL}<span>${escapeHtml(item.period)}</span></p>
      <p class="ui-modal__summary">${escapeHtml(item.summary)}</p>
      <h4 class="ui-modal__subtitle">主要工作</h4>
      <ul class="ui-modal__list">${item.highlights.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
      <ul class="ui-modal__tags">${item.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>`);

  const clearStagger = () => cards.forEach((card) => { card.style.transitionDelay = ''; });
  /* 窄屏下三张卡是整列堆叠的，没有「居中」这回事——点哪张就开哪张,翻面被 CSS 禁掉 */
  const isStacked = () => window.matchMedia('(max-width:700px)').matches;

  cards.forEach((card, index) => {
    const activate = () => {
      clearStagger();
      if (isStacked()) { fillModal(portfolio.experience[index]); return; }
      /* 桌面端流程：
         - 点非居中卡：把它抽到中间(同时收掉其他卡的翻面)
         - 点中间那张(无论正反面):翻转状态 ——
            正面 → 翻到背面看详细工作
            背面 → 翻回正面
         整张卡片就是入口,没有按钮、没有"返回",纯靠再次点击。 */
      if (index !== active) {
        active = index;
        center = index;
        flipped = -1;
        layout();
        return;
      }
      flipped = (flipped === index) ? -1 : index;
      layout();
    };
    card.addEventListener('click', activate);
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      activate();
    });
  });
  layout();

  /* 入场：卡片从口袋里"升"出来，依次错开；带 1.5s 兜底定时器 */
  const reveal = () => {
    stage.classList.add('is-visible');
    setTimeout(clearStagger, 1500);
  };
  cards.forEach((card, index) => { card.style.transitionDelay = `${index * 110}ms`; });
  if ('IntersectionObserver' in window) {
    const stageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
    stageObserver.observe(stage);
  }
  setTimeout(reveal, 1500);
}

/* ===== 个人作品：按钮占位提示 + 详情弹窗 ===== */
function initProjects(ui) {
  const stage = document.querySelector('[data-pj-stage]');
  if (!stage) return;

  document.querySelectorAll('[data-pj-more]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = portfolio.projects.find((project) => project.id === button.dataset.pjTarget);
      if (!item) return;
      ui.open(`
        <header class="ui-modal__head">
          <span class="pj-modal__no">${item.no}</span>
          <span class="ui-modal__names">
            <h3 id="ui-modal-title">${escapeHtml(item.title)}</h3>
            <p class="ui-modal__role">${escapeHtml(item.en)}</p>
          </span>
        </header>
        <ul class="ui-modal__tags pj-modal__tags">${item.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>
        <p class="ui-modal__summary">${escapeHtml(item.summary)}</p>
        <h4 class="ui-modal__subtitle">关键设计</h4>
        <ul class="ui-modal__list">${item.points.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
        <p class="pj-modal__scene"><b>${escapeHtml(item.sceneLabel)}</b>${escapeHtml(item.scene)}</p>`);
    });
  });

  /* 链接还没给：点一下给出提示，而不是跳去一个空锚点 */
  document.querySelectorAll('[data-pj-pending]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast(`${link.dataset.pjPending}暂时还没填 · 把链接写进 src/data.js 就自动生效`);
    });
  });

  /* 入场：两行依次淡入上浮 */
  const rows = [...stage.querySelectorAll('.pj-row')];
  const reveal = (row) => row.classList.add('is-visible');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        self.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rows.forEach((row, index) => {
      row.style.transitionDelay = `${index * 90}ms`;
      observer.observe(row);
    });
  }
  setTimeout(() => rows.forEach(reveal), 1500);
}

/* ===== 技能与爱好：五张卡片扇形轮播 =====
   位置表按「离中间那张的距离」给横向偏移/旋转/缩放，
   横向偏移写成卡片宽度的倍数，卡片多大扇形就多大。 */
const HB_SLOTS = [
  { x: 0, rot: 0, sc: 1, z: 5 },
  { x: .6, rot: 5.5, sc: .88, z: 4 },
  { x: .98, rot: 9.5, sc: .78, z: 3 },
];

function initHobbies() {
  /* 2026-09-12 bug 修复:之前 initHobbies 函数体内引用 interests[index],
     但 interests 是 render() 里的局部变量,顶层函数访问不到 —— 点击卡片
     时 ReferenceError 静默失败,完全没反应。改成从 portfolio 解构顶层拿到。 */
  const { interests } = portfolio;
  const fan = document.querySelector('[data-hb-fan]');
  if (!fan) return;

  const cards = [...fan.querySelectorAll('.hb-card')];
  const count = cards.length;
  /* 2026-09-12:用户要求默认中间那张是旅行(interests[1],即 index=1),
     而不是之前的 index=2(摄影)。 */
  let center = Math.min(1, count - 1);

  /* 扇形布局:沿用之前的 HB_SLOTS 位置表 + layout(),
     把 center 那张卡设为中心并放大,两侧倾斜+缩放+错开。
     用户反馈"4 列平铺没设计感",2026-09-12 改回扇形。
     但点击交互不再是"切 center"——而是直接打开画廊。 */
  const layout = () => {
    cards.forEach((card, index) => {
      const step = (index - center + count) % count;
      const mirrored = step > count / 2;
      const distance = Math.min(step, count - step);
      const slot = HB_SLOTS[Math.min(distance, HB_SLOTS.length - 1)];
      const sign = mirrored ? -1 : 1;
      card.style.setProperty('--fx', String(slot.x * sign));
      card.style.setProperty('--rot', `${slot.rot * sign}deg`);
      card.style.setProperty('--sc', String(slot.sc));
      card.style.zIndex = String(slot.z);
      card.classList.toggle('is-center', index === center);
      card.tabIndex = index === center ? 0 : -1;
    });
  };

  /* —— 画廊展开(2026-09-12 重做 5):5 张图轮播,只中间正视图,其他角度倾斜 ——
     距焦点:0 = 正中间(正视图,opacity 1)/ ±1 = 左右 1 张(明显,倾斜,opacity 0.78)/
     ±2 = 最外 1 张(半透明仍可见,opacity 0.4)。单击任意卡 → 该卡变焦点(动画重新布局)。
     进场:每张依次 stagger 动画(距离越远 delay 越久)。
     prev/next 按钮:循环切换焦点(像转圆圈)。 */
  const gallery = document.querySelector('[data-hb-gallery]');
  const mask = document.querySelector('[data-hb-mask]');
  const closeBtn = document.querySelector('[data-hb-close]');
  const photoList = document.querySelector('[data-hb-photo-list]');
  const prevPhotoBtn = document.querySelector('[data-hb-prev-photo]');
  const nextPhotoBtn = document.querySelector('[data-hb-next-photo]');
  const galleryTitle = gallery?.querySelector('.hb-gallery__title');
  const gallerySub = gallery?.querySelector('.hb-gallery__sub');

  let galleryIndex = -1;
  let galleryFocus = 0;

  /* 距焦点的距离 → 位置配置(2026-09-12 ±2 改 opacity 0.4 半透明可见,不再 0 隐藏) */
  const POSITIONS = {
    '-2': { x: '-205%', rot: -14, scale: 0.74, opacity: 0.4, z: 0 },
    '-1': { x: '-108%', rot:  -8, scale: 0.88, opacity: 0.78, z: 1 },
    '0':  { x: '0%',    rot:   0, scale: 1,    opacity: 1,    z: 3 },
    '1':  { x: '108%',  rot:   8, scale: 0.88, opacity: 0.78, z: 1 },
    '2':  { x: '205%',  rot:  14, scale: 0.74, opacity: 0.4, z: 0 },
  };

  /* 计算每张图距焦点的"环形最短距离" */
  const cyclicDist = (idx, focus, total) => {
    let d = idx - focus;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  /* 把当前 item 的所有 photos 渲染进 photoList(只在打开时调一次) */
  const renderGalleryPhotos = () => {
    const item = interests[galleryIndex];
    if (!item) return;
    photoList.innerHTML = item.photos.map((src, i) => `
      <li class="hb-photo" data-tone="${item.tone}" data-idx="${i}" style="opacity:0;transform:translate(-50%,-50%) translateY(20px) scale(.94);">
        ${src
          ? `<img class="hb-photo__img" src="${escapeHtml(src)}" alt="${escapeHtml(item.title)} 作品" loading="lazy">`
          : `<span class="hb-photo__placeholder" aria-label="${escapeHtml(item.title)} 占位图"></span>`}
      </li>`).join('');
    /* 单击任意卡 → 该卡变焦点(回到正中间) */
    photoList.querySelectorAll('.hb-photo').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = Number(el.dataset.idx);
        if (idx === galleryFocus) return;
        galleryFocus = idx;
        /* 切换焦点 = 左右滚动过渡(不是重新展开一次) */
        layoutGallery(false);
      });
    });
  };

  /* 按当前焦点重新布局所有 5 张图。
     关键(2026-09-12 用户反馈):"切换焦点时是左右滚动过渡,不是重新展开一次"。
     - 首次 (isInitial=true):5 张从 opacity 0 + translateY 渐入(stagger 60ms)
     - 后续 (isInitial=false):从当前位置(el.dataset.lastTransform/lastOpacity)过渡
       到新位置,只做 transform 平移 + 缩放 + 旋转,不再 fade in
     用 Web Animations API + dataset 记上次位置实现"水平滚动切换"效果。 */
  const layoutGallery = (isInitial = false) => {
    const els = [...photoList.querySelectorAll('.hb-photo')];
    const total = els.length;
    if (total === 0) return;
    els.forEach((el, i) => {
      const dist = cyclicDist(i, galleryFocus, total);
      const cfg = POSITIONS[String(dist)] || POSITIONS['0'];
      const targetTransform = `translate(-50%,-50%) translateX(${cfg.x}) rotate(${cfg.rot}deg) scale(${cfg.scale})`;
      const targetOpacity = cfg.opacity;
      /* from 状态:首次从"隐藏+模糊",后续从上次的目标位置(滚动) */
      const fromTransform = isInitial
        ? `translate(-50%,-50%) translateY(20px) scale(.94)`
        : (el.dataset.lastTransform || `translate(-50%,-50%) translateX(0) rotate(0) scale(1)`);
      const fromOpacity = isInitial ? 0 : Number(el.dataset.lastOpacity ?? 1);
      el.dataset.lastTransform = targetTransform;
      el.dataset.lastOpacity = String(targetOpacity);
      el.style.zIndex = String(cfg.z);
      el.animate(
        [
          { opacity: fromOpacity, transform: fromTransform },
          { opacity: targetOpacity, transform: targetTransform },
        ],
        { duration: 500, delay: isInitial ? Math.abs(dist) * 60 : 0, easing: 'cubic-bezier(.22, .61, .36, 1)', fill: 'forwards' }
      );
    });
  };

  const openGallery = (index) => {
    const item = interests[index];
    if (!item || !gallery || !mask) return;
    galleryIndex = index;
    galleryFocus = 0;
    renderGalleryPhotos();
    galleryTitle.textContent = item.title;
    gallerySub.textContent = item.en + ' · ' + item.detail;
    mask.hidden = false;
    gallery.hidden = false;
    requestAnimationFrame(() => {
      mask.classList.add('is-open');
      gallery.classList.add('is-open');
      document.body.classList.add('hb-locked');
      layoutGallery(true);
    });
  };

  const closeGallery = () => {
    if (!gallery || !mask) return;
    mask.classList.remove('is-open');
    gallery.classList.remove('is-open');
    document.body.classList.remove('hb-locked');
    setTimeout(() => {
      if (!gallery.classList.contains('is-open')) {
        mask.hidden = true;
        gallery.hidden = true;
        /* 2026-09-12 用户反馈:关闭后扇形轮播的 focus 切回刚点的那张主卡,
           否则左右两侧的卡永远轮不到。 */
        if (galleryIndex >= 0) {
          center = galleryIndex;
          layout();
        }
      }
    }, 380);
  };

  /* 切焦点:循环(像转圆圈) */
  const stepGallery = (delta) => {
    const total = photoList.querySelectorAll('.hb-photo').length;
    if (total === 0) return;
    galleryFocus = (galleryFocus + delta + total) % total;
    /* prev/next 切焦点 = 左右滚动过渡 */
    layoutGallery(false);
  };

  /* 点卡 = 打开画廊(2026-09-12:用事件委托兜底,即使单卡 listener 没绑上,document
     级委托也会接住点击并打开画廊) */
  cards.forEach((card, index) => {
    card.addEventListener('click', () => openGallery(index));
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openGallery(index);
    });
  });
  /* 事件委托:在卡片被替换/重新渲染时仍能工作,主 listener 失效时兜底 */
  document.addEventListener('click', (event) => {
    const card = event.target.closest && event.target.closest('.hb-card');
    if (!card || !fan || !fan.contains(card)) return;
    const idx = cards.indexOf(card);
    if (idx >= 0) openGallery(idx);
  });

  /* 切焦点:左/右按钮 + 键盘左右箭头 */
  prevPhotoBtn?.addEventListener('click', () => stepGallery(-1));
  nextPhotoBtn?.addEventListener('click', () => stepGallery(1));
  document.addEventListener('keydown', (event) => {
    if (!gallery || gallery.hidden) return;
    if (event.key === 'ArrowLeft') stepGallery(-1);
    if (event.key === 'ArrowRight') stepGallery(1);
  });

  /* 关闭交互:✕ 按钮 / 蒙层空白 / Esc 键 */
  closeBtn?.addEventListener('click', closeGallery);
  mask?.addEventListener('click', closeGallery);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && gallery && !gallery.hidden) closeGallery();
  });

  /* 卡片入场:IntersectionObserver 触发 is-visible 渐显,
     1.5s 兜底防止任何异常让卡片停在 opacity:0 不可见。 */
  const reveal = () => fan.classList.add('is-visible');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal();
        self.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    observer.observe(fan);
  }
  setTimeout(reveal, 1500);

  layout();
}

function setNavActive(id) {
  document.querySelectorAll('.primary-nav [data-nav]').forEach((link) => {
    const active = link.dataset.nav === id;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

/* ===== 联系我：hover 卡片时露出复制按钮，点按钮把对应账号拷到剪贴板 ===== */
function initContact() {
  /* 不同 tone 用的提示文案,跟前端展示字段对应 */
  const toneLabel = { mail: '邮箱', phone: '手机号', xhs: '小红书账号' };
  document.querySelectorAll('[data-ct-copy-trigger]').forEach((button) => {
    const card = button.closest('[data-ct-tone]');
    if (!card) return;
    const value = card.dataset.ctValue;
    const label = toneLabel[card.dataset.ctTone] || '内容';
    const tip = button.querySelector('.ct-card__copy-tip');
    const originalTip = tip ? tip.textContent : '';
    let resetTimer = null;
    button.addEventListener('click', async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          /* 非安全源（老浏览器 / 某些内嵌环境）下 clipboard API 不可用，退回临时输入框 */
          const scratch = document.createElement('textarea');
          scratch.value = value;
          scratch.setAttribute('readonly', '');
          scratch.style.cssText = 'position:fixed;top:-9999px;opacity:0';
          document.body.appendChild(scratch);
          scratch.select();
          document.execCommand('copy');
          scratch.remove();
        }
        showToast(`${label} ${value} 已复制到剪贴板`);
        button.classList.add('is-copied');
        if (tip) tip.textContent = '已复制';
      } catch {
        showToast(`${label}：${value}`);
      } finally {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          button.classList.remove('is-copied');
          if (tip) tip.textContent = originalTip;
        }, 1600);
      }
    });
  });
}

function bindEvents() {
  const nav = document.querySelector('.primary-nav');
  const menuButton = document.querySelector('.menu-toggle');

  menuButton.addEventListener('click', (event) => {
    const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true';
    event.currentTarget.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open', !expanded);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    } else if (event.target.closest('.primary-nav a')) {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });

  /* 滚动进入时高亮当前导航项 */
  const sections = [...document.querySelectorAll('.section-anchor')];
  const syncNav = () => {
    const boxes = sections.map((section) => {
      const rect = section.getBoundingClientRect();
      return { id: section.id, top: rect.top, bottom: rect.bottom };
    });
    setNavActive(getActiveSection(boxes, window.innerHeight * 0.32));
  };
  const sectionObserver = new IntersectionObserver(syncNav, { threshold: [0, 0.25, 0.65] });
  sections.forEach((section) => sectionObserver.observe(section));

  /* 卡片入场：淡入上浮。带 1.5s 兜底定时器，任何异常都不会让卡片停在不可见状态 */
  const cards = [...document.querySelectorAll('.edu-card')];
  const reveal = (card) => {
    card.classList.add('is-visible');
    /* 入场用的 transition-delay 是内联写上去的，落位后必须清掉，
       否则 hover 的位移/阴影也会被这段延迟拖一下 */
    card.addEventListener('transitionend', () => { card.style.transitionDelay = ''; }, { once: true });
  };
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 90}ms`;
      cardObserver.observe(card);
    });
  }
  setTimeout(() => cards.forEach(reveal), 1500);

  const ui = createModal();
  initExperience(ui);
  initProjects(ui);
  initHobbies();
  initContact();
}

render();
bindEvents();
if (location.hash && !document.querySelector(location.hash)) {
  history.replaceState(null, '', `${location.pathname}${location.search}#about`);
}
