(() => {
  const PLAN_LIST = [
    { id: "16-8", label: "16:8", name: "轻断食", hours: 16, desc: "适合初学者，改善血糖" },
    { id: "18-6", label: "18:6", name: "进阶断食", hours: 18, desc: "提升胰岛素敏感性" },
    { id: "20-4", label: "20:4", name: "勇士断食", hours: 20, desc: "强效代谢重置" }
  ];

  const PHASE_LIST = [
    { hour: 4, title: "胰岛素下降", desc: "血糖平稳，脂肪分解开始启动", icon: "📉", color: "#7c6ff7" },
    { hour: 8, title: "进入酮症", desc: "身体切换为燃烧脂肪供能", icon: "🔥", color: "#f97316" },
    { hour: 12, title: "自噬启动", desc: "细胞开始深度清洁与修复", icon: "✨", color: "#22d3ee" },
    { hour: 16, title: "代谢重置", desc: "生长激素分泌增加，血管修复", icon: "💪", color: "#4ade80" },
    { hour: 20, title: "深度自噬", desc: "炎症标志物显著降低", icon: "🧬", color: "#f472b6" }
  ];

  const TIP_LIST = [
    "多喝水、无糖茶或黑咖啡可帮助度过断食期",
    "感到轻微头晕属正常，补充电解质（盐水）有帮助",
    "断食期间轻度运动（散步）可加速脂肪燃烧",
    "打破断食时，从少量蛋白质或蔬菜开始",
    "规律断食2-4周后，血糖控制会明显改善",
    "糖尿病服药患者请务必在医生监督下进行断食",
    "断食期间睡眠时间计入断食时长，利用好夜间"
  ];

  const STEADY_KNOWLEDGE_BASE = [
    ["饭后血糖通常会先上升再回落，", "观察时间比单看一次数字更有意义。"],
    ["餐后30分钟提醒不是诊断，", "它更像一个观察餐后状态的时间锚点。"],
    ["饭后轻松散步有助于肌肉利用葡萄糖，", "不需要剧烈运动，舒服走动就可以。"],
    ["餐后马上躺下容易让身体更懒得消耗，", "先坐一会儿或慢走更适合稳糖。"],
    ["同样一餐，不同人的血糖反应会不同，", "连续记录能看出自己的规律。"],
    ["主食吃得越精细，餐后上升可能越明显，", "粗粮和杂豆通常更耐消化。"],
    ["先吃蔬菜和蛋白质，再吃主食，", "不少人会感觉餐后波动更平缓。"],
    ["吃饭太快容易在短时间摄入过多碳水，", "放慢速度能给身体更多反应时间。"],
    ["含糖饮料会让糖分吸收很快，", "日常更适合选择白水或无糖茶。"],
    ["水果也有糖，餐后马上大量吃，", "可能让血糖峰值更靠后或更高。"],
    ["饭后犯困不一定只是睡眠不足，", "也可能和餐后血糖波动有关。"],
    ["晚餐后活动量通常更少，", "所以晚餐后的稳糖观察更值得留意。"],
    ["餐后高峰常见于30到60分钟附近，", "但具体时间会受餐量和食物影响。"],
    ["回落通常需要更长时间，", "不要只看提醒点那一刻的状态。"],
    ["油脂多的餐可能让吸收变慢，", "血糖高峰有时会出现得更晚。"],
    ["蛋白质和膳食纤维能增加饱腹感，", "也有助于减少餐后大起大落。"],
    ["饭后口渴、疲惫或心慌，", "可以记录下来和餐食一起对照。"],
    ["同一顿饭后记录多几次，", "比只记某一天更容易发现规律。"],
    ["运动前后都要听身体感受，", "不舒服时不要硬撑着走路。"],
    ["餐后活动以轻松为主，", "能说话、不喘得厉害更适合作为日常习惯。"],
    ["睡前加餐可能影响夜间血糖和睡眠，", "如果经常想吃，先观察晚餐结构。"],
    ["外食常有隐藏糖和油，", "餐后提醒能帮你识别哪些菜更容易波动。"],
    ["同样是主食，分量差一点，", "餐后曲线可能就会明显不同。"],
    ["稳定不是完全不升高，", "而是上升和回落都比较平缓。"],
    ["餐后记录不需要追求完美，", "能坚持观察趋势就已经有价值。"],
    ["压力和睡眠也会影响血糖，", "不要把所有变化都归因于一顿饭。"],
    ["如果正在用降糖药或胰岛素，", "运动和饮食调整要先听医生建议。"],
    ["低血糖风险人群不要盲目运动，", "出现发抖、出汗、心慌要及时处理。"],
    ["把提醒当成习惯入口，", "不是压力任务，能坚持才最重要。"],
    ["今天的记录会帮助明天做选择，", "稳糖靠的是长期小调整。"]
  ];
  const STEADY_KNOWLEDGE_LIST = buildSteadyKnowledgeList(STEADY_KNOWLEDGE_BASE);

  const SCREEN_ORDER = ["home", "fasting", "weight", "steady", "history"];
  const WEEK_DAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const DAY_ORDER_DESC = [6, 5, 4, 3, 2, 1, 0];
  const ARC_LENGTH = 628.3;
  const MEAL_REMINDER_MINUTES = 30;
  const MEAL_OBSERVE_MINUTES = 120;
  const store = createStore();

  const state = {
    selectedPlan: PLAN_LIST[0],
    isRunning: false,
    startTimestamp: null,
    elapsed: 0,
    timerId: null,
    tipIndex: 0,
    tipTimerId: null,
    deferredPrompt: null,
    fastingRecords: normalizeFastingRecords(readJSON("fasting_records", [])),
    weightRecords: normalizeWeightRecords(readJSON("weight_records", [])),
    steadyRecords: normalizeSteadyRecords(readJSON("steady_records", [])),
    activeMeal: readJSON("active_meal", null),
    goalWeight: readNumber("goal_weight"),
    userHeight: readNumber("user_height"),
    historyWeekOffset: 0,
    weightWeekOffset: 0,
    chartPeriod: 7,
    currentScreenIndex: 0,
    fastingChart: null,
    lastPhaseHour: -1,
    milestoneTimerId: null,
    clearTimerId: null,
    clearProgress: 0,
    steadyTimerId: null,
    steadyKnowledgeIndex: -1,
    steadyKnowledgeQueue: [],
    steadyKnowledgeTimerId: null,
    reminderPlayer: null,
    reminderAudio: null,
    reminderSoundTimerId: null,
    reminderAutoStopTimerId: null,
    themeMode: safeGet("themeMode") || "auto",
    themeHoldTimerId: null,
    themeHoldTriggered: false
  };

  function buildSteadyKnowledgeList(base) {
    const extra = [
      ["早餐后的血糖反应很值得观察，", "它常能反映前一晚睡眠和晚餐影响。"],
      ["午餐如果主食偏多，", "下午犯困和波动可能会更明显。"],
      ["晚餐吃得太晚，", "可能让夜间身体还在处理餐后负担。"],
      ["餐后不要马上剧烈运动，", "轻松走动比突然高强度更适合日常。"],
      ["饭后站立一会儿也有帮助，", "比立刻久坐更容易形成稳糖习惯。"],
      ["主食可以分散到一餐中慢慢吃，", "不要一开始就集中吃很多。"],
      ["蔬菜体积大、能量低，", "放在餐前能帮助控制整体进食速度。"],
      ["豆类含有蛋白质和纤维，", "搭配主食时通常更耐饿。"],
      ["白粥和软烂面食吸收较快，", "餐后反应可能比米饭更明显。"],
      ["同样是米饭，冷却后再加热，", "有些人餐后反应会更平缓。"],
      ["汤泡饭容易吃得快，", "也容易不知不觉吃多主食。"],
      ["甜点放在正餐后也会叠加影响，", "不是饭后吃就完全没关系。"],
      ["坚果能增加饱腹感，", "但分量太多也会带来额外热量。"],
      ["酸奶要看配料表，", "很多风味酸奶含糖并不低。"],
      ["无糖不等于可以无限吃，", "总量和搭配仍然会影响餐后状态。"],
      ["水果更适合控制份量，", "一次吃太多也可能拉高餐后波动。"],
      ["果汁比完整水果吸收更快，", "日常稳糖更建议少喝果汁。"],
      ["奶茶和甜咖啡很容易隐藏糖，", "看起来一杯，影响可能像一份甜点。"],
      ["外卖酱汁常含糖和淀粉，", "拌饭拌面时更容易吃多。"],
      ["勾芡菜容易让碳水增加，", "餐后观察时可以单独留意。"],
      ["油炸食物可能让消化变慢，", "血糖变化有时会拖得更久。"],
      ["高油高糖一起出现，", "餐后状态可能比单一主食更难预测。"],
      ["吃到七八分饱更容易坚持，", "过饱常让餐后疲惫更明显。"],
      ["细嚼慢咽不是口号，", "它能减少短时间内的碳水冲击。"],
      ["每餐固定一个观察点，", "比偶尔想起来记录更容易形成趋势。"],
      ["记录餐后状态时，", "把餐食、时间和活动一起记更有用。"],
      ["只看一天容易误判，", "看一周趋势更接近真实习惯。"],
      ["偶尔波动不用太紧张，", "关键是看是否经常重复出现。"],
      ["餐后精神状态也是信号，", "困倦、口渴、心慌都可以做备注。"],
      ["如果某类餐总让你不舒服，", "下次可以先减量而不是完全禁止。"],
      ["规律吃饭有助于观察规律，", "忽早忽晚会让对比变得困难。"],
      ["饭后走路不追求步数，", "能持续坚持比一次走很多更重要。"],
      ["家务也算轻活动，", "饭后收拾一下比直接躺着更好。"],
      ["坐办公室的人饭后可以多起身，", "短暂走动也能打断久坐。"],
      ["楼下慢走几分钟，", "比强迫自己运动半小时更容易坚持。"],
      ["运动时如果头晕或心慌，", "要先停下来观察身体状态。"],
      ["低血糖风险人群要更谨慎，", "饭后活动前后都要注意感受。"],
      ["药物使用者别自行大改饮食，", "稳糖调整最好和医生建议一致。"],
      ["睡眠不足会影响第二天代谢，", "同样一餐也可能反应更大。"],
      ["压力大时身体更紧绷，", "餐后反应也可能和平时不同。"],
      ["熬夜后吃高糖早餐，", "很多人会更容易出现困倦。"],
      ["规律作息是稳糖的一部分，", "它和吃什么同样值得记录。"],
      ["饮水不足会让身体状态变差，", "餐后可以少量多次喝水。"],
      ["不要用甜饮替代水，", "它会让观察餐后变化更复杂。"],
      ["咖啡因会影响部分人的心率，", "如果饭后心慌，可以留意咖啡。"],
      ["酒精会干扰身体代谢，", "餐后和夜间状态都可能受影响。"],
      ["一餐中蛋白质太少，", "饱腹感可能不够，饭后更想加餐。"],
      ["蔬菜不是越少越省事，", "它常是让餐后更平稳的基础。"],
      ["主食不是敌人，", "分量、种类和搭配才是重点。"],
      ["完全不吃主食不一定适合每个人，", "长期习惯要看身体反馈。"],
      ["餐后提醒可以帮你暂停一下，", "看看自己是想动一动还是继续久坐。"],
      ["有些餐后反应来自吃太快，", "下次先试着延长用餐时间。"],
      ["吃饭顺序可以先从一餐尝试，", "不用一开始就要求每餐完美。"],
      ["同样菜品换个烹调方式，", "餐后感受可能会不一样。"],
      ["蒸煮炖通常更清爽，", "重油重糖会让观察更复杂。"],
      ["酱料可以单独放，", "少量蘸取比全部拌入更容易控制。"],
      ["外食时先看主食分量，", "很多波动来自饭面粉的总量。"],
      ["一顿吃多了不代表失败，", "下一餐回到正常节奏就可以。"],
      ["稳糖更像长期调参，", "不是靠一次严格控制完成。"],
      ["记录越简单越容易坚持，", "复杂表格反而可能让人放弃。"],
      ["餐后30分钟是提醒点，", "不是血糖变化的终点。"],
      ["60分钟附近常值得继续观察，", "特别是吃了较多主食的时候。"],
      ["120分钟后的回落情况，", "能帮助判断这一餐是否拖得太久。"],
      ["如果餐后很快又饿，", "可以回看蛋白质和纤维是否不足。"],
      ["饭后想吃甜食时先等一会儿，", "有时只是习惯而不是真的饿。"],
      ["把常吃餐食做成对照，", "更容易找出适合自己的组合。"],
      ["同样分量的主食，", "搭配蔬菜和蛋白质后反应可能不同。"],
      ["饭后散步不需要很远，", "关键是让身体从静止切换到轻活动。"],
      ["餐后观察不是为了焦虑，", "而是为了减少下一次的盲目选择。"],
      ["看到规律后再调整，", "比凭感觉突然改变更稳妥。"]
    ];
    return base.concat(extra).slice(0, 100);
  }

  function $(id) { return document.getElementById(id); }
  function first(selector) { return document.querySelector(selector); }
  function createStore() {
    try {
      const storage = window.localStorage;
      const testKey = "__fasting_guard__";
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return storage;
    } catch (_) {
      const memory = new Map();
      return {
        getItem(key) { return memory.has(key) ? memory.get(key) : null; },
        setItem(key, value) { memory.set(key, String(value)); },
        removeItem(key) { memory.delete(key); }
      };
    }
  }
  function safeGet(key) {
    try { return store.getItem(key); } catch (_) { return null; }
  }
  function safeSet(key, value) {
    try { store.setItem(key, value); } catch (_) {}
  }
  function safeRemove(key) {
    try { store.removeItem(key); } catch (_) {}
  }
  function readJSON(key, fallback) {
    try { return JSON.parse(safeGet(key) || JSON.stringify(fallback)); }
    catch (_) { return fallback; }
  }
  function readNumber(key) {
    const value = parseFloat(safeGet(key));
    return Number.isFinite(value) ? value : 0;
  }
  function saveJSON(key, value) { safeSet(key, JSON.stringify(value)); }
  function pad(value) { return String(value).padStart(2, "0"); }
  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }
  function dateToISO(date) {
    const china = new Date(date.getTime() + 8 * 3600 * 1000);
    return china.toISOString().slice(0, 10);
  }
  function zhToISO(value) {
    if (!value) return dateToISO(new Date());
    if (!value.includes("/")) return value;
    const parts = value.split("/");
    return parts[0] + "-" + pad(parts[1]) + "-" + pad(parts[2]);
  }
  function isoToLocalDate(iso) {
    const parts = iso.split("-").map(Number);
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]) - 8 * 3600 * 1000);
  }
  function dayNumber(iso) {
    const parts = iso.split("-").map(Number);
    return Math.floor(Date.UTC(parts[0], parts[1] - 1, parts[2]) / 86400000);
  }
  function normalizeFastingRecords(records) {
    return (Array.isArray(records) ? records : []).map(record => ({ ...record, date: zhToISO(record.date) }));
  }
  function normalizeWeightRecords(records) {
    return (Array.isArray(records) ? records : []).map(record => ({ ...record, date: zhToISO(record.date) }));
  }
  function normalizeSteadyRecords(records) {
    return (Array.isArray(records) ? records : []).map(record => ({ ...record, date: zhToISO(record.date) }));
  }
  function weekBounds(offset) {
    const now = new Date();
    const weekday = now.getDay();
    const diffToMonday = weekday === 0 ? -6 : 1 - weekday;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday - offset * 7);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { monday, sunday };
  }
  function isoWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }
  function currentPhase() {
    const hours = state.elapsed / 3600;
    return [...PHASE_LIST].reverse().find(phase => hours >= phase.hour) || PHASE_LIST[0];
  }
  function nextPhase() {
    const hours = state.elapsed / 3600;
    return PHASE_LIST.find(phase => phase.hour > hours);
  }

  function init() {
    bindDeclarativeEvents();
    const wrap = $("screen-wrap");
    if (wrap) {
      wrap.style.transition = "none";
      wrap.style.transform = "translateX(0%)";
      setTimeout(() => { wrap.style.transition = ""; }, 50);
    }
    renderPlanGrid();
    renderPhasePreview();
    renderHistory();
    renderWeightScreen();
    renderSteadyScreen();
    startSteadyKnowledgeTicker();
    rotateTips();
    applyTheme();
    restoreRunningFast();
    startSteadyTicker();
    initSwipe();
  }

  function bindDeclarativeEvents() {
    if (document.documentElement.dataset.fastingEventsReady) return;
    document.documentElement.dataset.fastingEventsReady = "1";
    document.addEventListener("click", event => {
      const target = event.target.closest("[onclick]");
      if (!target) return;
      const source = target.getAttribute("onclick") || "";
      const handled = runInlineAction(source, event);
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
    const importInput = document.querySelector('input[type="file"][accept=".json"]');
    if (importInput && !importInput.hasAttribute("onchange")) importInput.addEventListener("change", importData);
    const clearButton = $("clear-btn");
    if (clearButton) {
      clearButton.addEventListener("mousedown", startClearLP);
      clearButton.addEventListener("touchstart", startClearLP, { passive: false });
      clearButton.addEventListener("mouseup", () => cancelClearLP());
      clearButton.addEventListener("mouseleave", () => cancelClearLP());
      clearButton.addEventListener("touchend", () => cancelClearLP());
    }
  }

  function runInlineAction(source, event) {
    const match = source.trim().match(/^([A-Za-z_$][\w$]*)\((.*)\)$/);
    if (!match) return false;
    const actions = {
      selectPlan, startFast, endFast, showAdjustModal, hideAdjustModal, applyAdjust,
      showScreen, toggleTheme, installApp, dismissInstall,
      showHeightModal, hideHeightModal, saveHeight, showGoalModal, hideGoalModal, saveGoal,
      showMealReminderModal, hideMealReminderModal, saveMealReminder,
      nextSteadyKnowledge,
      addWeight, deleteWeight, deleteSteadyRecord, setChartPeriod, exportData, importData,
      recordMeal, ackMealReminder, completeMealReminder, cancelStableMeal,
      deleteRecord, historyPrev: window.historyPrev, historyNext: window.historyNext,
      weightPrev: window.weightPrev, weightNext: window.weightNext
    };
    const fn = actions[match[1]];
    if (typeof fn !== "function") return false;
    const args = parseInlineArgs(match[2], event);
    fn(...args);
    return true;
  }

  function parseInlineArgs(raw, event) {
    const text = raw.trim();
    if (!text) return [];
    if (text === "event") return [event];
    return text.split(",").map(part => {
      const value = part.trim();
      if (value === "event") return event;
      if (/^['"].*['"]$/.test(value)) return value.slice(1, -1);
      const number = Number(value);
      return Number.isNaN(number) ? value : number;
    });
  }

  function renderPlanGrid() {
    const grid = $("plan-grid");
    if (!grid) return;
    grid.innerHTML = PLAN_LIST.map(plan =>
      "<div class='plan-card " + (plan.id === state.selectedPlan.id ? "active" : "") + "' data-plan='" + plan.id + "' onclick=\"selectPlan('" + plan.id + "')\">" +
        "<div class='plan-hours'>" + plan.label + "</div>" +
        "<div class='plan-name'>" + plan.name + "</div>" +
        "<div class='plan-desc'>" + plan.desc + "</div>" +
      "</div>"
    ).join("");
  }
  function renderPhasePreview() {
    const container = $("phase-preview");
    if (!container) return;
    container.innerHTML = PHASE_LIST.map(phase =>
      "<div class='phase-item'>" +
        "<div class='phase-emoji' style='background:" + phase.color + "22;'>" + phase.icon + "</div>" +
        "<div><div class='phase-title'>" + phase.title + "</div>" +
        "<div class='phase-hour'>" + phase.hour + "小时后 · " + phase.desc + "</div></div>" +
      "</div>"
    ).join("");
  }
  function renderHistory() {
    renderHeatmap();
    const total = state.fastingRecords.length;
    const completed = state.fastingRecords.filter(record => record.completed).length;
    const totalEl = $("h-total");
    const completedEl = $("h-completed");
    const streakEl = $("h-streak");
    if (totalEl) totalEl.textContent = total;
    if (completedEl) completedEl.textContent = total ? Math.round(completed / total * 100) + "%" : "0%";
    if (streakEl) streakEl.textContent = calcStreak();

    const list = $("history-list");
    if (!list) return;
    if (!total) {
      list.innerHTML = "<div class='empty-state'><div class='empty-icon'>🌙</div><div class='empty-text'>还没有断食记录<br>开始你的第一次断食吧</div></div>";
      const nav = $("history-nav");
      if (nav) nav.innerHTML = "";
      return;
    }
    renderHistoryPage();
  }
  function renderHeatmap() {
    const canvas = $("fasting-bar-chart");
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.parentElement ? canvas.parentElement.clientWidth || canvas.offsetWidth || 320 : canvas.offsetWidth || 320;
    const height = canvas.parentElement ? canvas.parentElement.clientHeight || 100 : 100;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = "100%";
    canvas.style.height = height + "px";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const days = [];
    const today = new Date();
    for (let index = 29; index >= 0; index--) {
      const d = new Date(today);
      d.setDate(today.getDate() - index);
      const iso = dateToISO(d);
      const record = state.fastingRecords.find(item => item.date === iso);
      days.push({ date: iso, hours: record ? record.duration / 3600 : 0, target: record ? record.planHours || 16 : 16 });
    }

    const maxHours = 25;
    const target = state.fastingRecords.length ? state.fastingRecords[0].planHours || 16 : 16;
    const pad = { top: 8, right: 6, bottom: 18, left: 6 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    const gap = 3;
    const barW = Math.max(3, (plotW - gap * (days.length - 1)) / days.length);
    const yOf = value => pad.top + plotH - Math.min(value, maxHours) / maxHours * plotH;

    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = "rgba(180,178,169,0.45)";
    ctx.lineWidth = 1;
    const targetY = yOf(target);
    ctx.beginPath();
    ctx.moveTo(pad.left, targetY);
    ctx.lineTo(width - pad.right, targetY);
    ctx.stroke();
    ctx.restore();

    days.forEach((day, index) => {
      const x = pad.left + index * (barW + gap);
      const value = day.hours === 0 ? 0.5 : day.hours;
      const h = Math.max(2, plotH - (yOf(value) - pad.top));
      const y = pad.top + plotH - h;
      let color = "#d3d1c7";
      if (day.hours > 0 && day.hours >= day.target + 2) color = "#ef9f27";
      else if (day.hours > 0 && day.hours >= day.target) color = "#639922";
      else if (day.hours > 0) color = "#b4b2a9";
      ctx.fillStyle = color;
      roundedRect(ctx, x, y, barW, h, 3);
      ctx.fill();
      if ([0, 9, 19, 29].includes(index)) {
        ctx.fillStyle = "#666";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(day.date.slice(5), x + barW / 2, height - 4);
      }
    });
  }
  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  function historyRow(record, dayLabel) {
    const goalHours = record.goalHours || (record.planLabel ? parseInt(record.planLabel, 10) || 16 : 16);
    const doneHours = record.duration / 3600;
    let badgeClass = "badge-ok";
    let badgeText = "完成 " + formatTime(record.duration);
    if (!record.completed) { badgeClass = "badge-partial"; badgeText = "提前 " + formatTime(record.duration); }
    else if (doneHours >= goalHours + 2) { badgeClass = "badge-over"; badgeText = "超标 " + formatTime(record.duration); }
    return "<div class='rec-item fade-in' id='rec-" + record.id + "'>" +
      "<div style='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:15px;font-weight:900;color:var(--text3);opacity:0.08;white-space:nowrap;pointer-events:none;letter-spacing:1px;'>" + (record.planLabel ? record.planLabel + "断食" : "") + "</div>" +
      "<div><div class='rec-left'>" + dayLabel + " · " + record.date + "</div></div>" +
      "<div style='display:flex;align-items:center;gap:10px;flex-shrink:0;'><span class='rec-badge " + badgeClass + "'>" + badgeText + "</span>" + trashButton("deleteRecord(" + record.id + ")") + "</div></div>";
  }
  function blankRow(dayLabel, iso) {
    return "<div style='display:flex;align-items:center;justify-content:space-between;background:transparent;border:1px solid var(--border);border-radius:14px;padding:12px 14px;margin-bottom:8px;pointer-events:none;opacity:0.35;'>" +
      "<div><div style='font-size:13px;color:var(--text2);'>" + dayLabel + " · " + iso + "</div></div><div style='font-size:12px;color:var(--text3);'>无记录</div></div>";
  }
  function trashButton(action) {
    return "<button onclick='" + action + "' style='background:none;border:none;padding:4px;cursor:pointer;color:var(--text3);opacity:0.4;display:flex;align-items:center;position:relative;'>" +
      "<svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'/><path d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6'/><path d='M10 11v6'/><path d='M14 11v6'/><path d='M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'/></svg></button>";
  }
  function pagerButton(enabled, action, label) {
    return "<button onclick='" + action + "' " + (!enabled ? "disabled" : "") + " style='padding:6px 12px;border-radius:10px;font-size:13px;font-weight:700;font-family:inherit;cursor:" + (enabled ? "pointer" : "default") + ";background:" + (enabled ? "rgba(74,158,255,0.12)" : "rgba(255,255,255,0.03)") + ";border:1px solid " + (enabled ? "rgba(74,158,255,0.35)" : "var(--border)") + ";color:" + (enabled ? "var(--blue)" : "var(--text3)") + ";'>" + label + "</button>";
  }
  function updateHistoryNav(hasOlder, hasNewer, label) {
    const nav = $("history-nav");
    if (!nav) return;
    const center = label ? "<span style='font-size:12px;font-weight:700;color:var(--text2);padding:0 4px;'>" + label + "</span>" : "";
    nav.innerHTML = pagerButton(hasNewer, "historyPrev()", "‹ 上一页") + center + pagerButton(hasOlder, "historyNext()", "下一页 ›");
  }
  function renderHistoryPage() {
    const list = $("history-list");
    if (!list) return;
    const rows = [];
    if (state.historyWeekOffset === 0) {
      const latestDate = state.fastingRecords.length ? state.fastingRecords[0].date : dateToISO(new Date());
      const latest = isoToLocalDate(latestDate);
      for (let index = 0; index < 7; index++) {
        const d = new Date(latest);
        d.setDate(latest.getDate() - index);
        const iso = dateToISO(d);
        const dayLabel = WEEK_DAYS[(d.getDay() + 6) % 7];
        const records = state.fastingRecords.filter(record => record.date === iso);
        rows.push(records.length ? records.map(record => historyRow(record, dayLabel)).join("") : blankRow(dayLabel, iso));
      }
      const cutoffDate = new Date(latest);
      cutoffDate.setDate(latest.getDate() - 6);
      updateHistoryNav(state.fastingRecords.some(record => record.date < dateToISO(cutoffDate)), false, "第 " + isoWeek(latest) + " 周");
    } else {
      const bounds = weekBounds(state.historyWeekOffset);
      const mondayISO = dateToISO(bounds.monday);
      DAY_ORDER_DESC.forEach(offset => {
        const d = new Date(bounds.monday);
        d.setDate(bounds.monday.getDate() + offset);
        const iso = dateToISO(d);
        const records = state.fastingRecords.filter(record => record.date === iso);
        rows.push(records.length ? records.map(record => historyRow(record, WEEK_DAYS[offset])).join("") : blankRow(WEEK_DAYS[offset], iso));
      });
      const earliest = state.fastingRecords.length ? state.fastingRecords[state.fastingRecords.length - 1].date : "";
      updateHistoryNav(earliest < mondayISO, true, "第 " + isoWeek(bounds.monday) + " 周");
    }
    list.innerHTML = rows.join("");
  }
  function calcStreak() {
    const dates = [...new Set(state.fastingRecords.map(record => record.date).filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date)))].sort().reverse();
    if (!dates.length) return 0;
    const today = dayNumber(dateToISO(new Date()));
    const startOffset = today - dayNumber(dates[0]);
    if (startOffset > 1) return 0;
    let streak = 0;
    for (let index = 0; index < dates.length; index++) {
      if (dayNumber(dates[index]) !== today - startOffset - index) break;
      streak += 1;
    }
    return streak;
  }

  function selectPlan(id) {
    const plan = PLAN_LIST.find(item => item.id === id);
    if (!plan) return;
    state.selectedPlan = plan;
    renderPlanGrid();
    renderPhasePreview();
    updateStartButton();
  }
  function updateStartButton() {
    const button = first(".start-btn");
    if (!button) return;
    button.textContent = state.isRunning ? "📍 断食进行中 — 查看计时 →" : "开始 " + state.selectedPlan.label + " 断食 →";
  }
  function saveFastingState() {
    const value = JSON.stringify({ startTimestamp: state.startTimestamp, planId: state.selectedPlan.id });
    safeSet("fasting_state", value);
    try {
      document.cookie = "fasting_state=" + encodeURIComponent(value) + ";expires=" + new Date(Date.now() + 365 * 864e5).toUTCString() + ";path=/";
    } catch (_) {}
  }
  function loadFastingState() {
    try {
      const value = safeGet("fasting_state");
      if (value) return value;
    } catch (_) {}
    try {
      const cookie = document.cookie.split(";").map(item => item.trim()).find(item => item.startsWith("fasting_state="));
      return cookie ? decodeURIComponent(cookie.slice("fasting_state=".length)) : null;
    } catch (_) { return null; }
  }
  function clearFastingState() {
    safeRemove("fasting_state");
    try { document.cookie = "fasting_state=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"; } catch (_) {}
  }
  function restoreRunningFast() {
    const saved = loadFastingState();
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      const timestamp = Number(parsed.startTimestamp);
      if (!timestamp) return;
      state.startTimestamp = timestamp;
      state.selectedPlan = PLAN_LIST.find(plan => plan.id === parsed.planId) || PLAN_LIST[0];
      state.isRunning = true;
      state.elapsed = Math.max(0, Math.floor((Date.now() - state.startTimestamp) / 1000));
      state.lastPhaseHour = currentPhase().hour;
      startTimer();
      updateStartButton();
      showScreen("fasting");
      updateFastingUI();
    } catch (error) { console.warn("fasting_state restore failed", error); }
  }
  function restoreTimerFromStorage() {
    if (!state.isRunning) { restoreRunningFast(); return; }
    if (!state.startTimestamp) return;
    state.elapsed = Math.max(0, Math.floor((Date.now() - state.startTimestamp) / 1000));
    startTimer();
    updateFastingUI();
  }
  function startFast() {
    if (state.isRunning) { showScreen("fasting"); return; }
    state.startTimestamp = Date.now();
    state.elapsed = 0;
    state.isRunning = true;
    state.lastPhaseHour = -1;
    saveFastingState();
    updateStartButton();
    startTimer();
    showScreen("fasting");
    updateFastingUI();
  }
  function startTimer() {
    clearInterval(state.timerId);
    state.timerId = setInterval(() => {
      state.elapsed = Math.max(0, Math.floor((Date.now() - state.startTimestamp) / 1000));
      updateFastingUI();
    }, 1000);
    const badge = $("fast-plan-badge-circle");
    if (badge) { badge.textContent = state.selectedPlan.label; badge.style.display = "inline-block"; }
    const target = $("stat-target");
    if (target) target.textContent = state.selectedPlan.hours + "h";
  }
  function updateFastingUI() {
    const targetSeconds = state.selectedPlan.hours * 3600;
    const progress = Math.min(state.elapsed / targetSeconds, 1);
    const phase = currentPhase();
    const next = nextPhase();
    const arc = $("arc-progress");
    const glow = $("arc-glow-circle");
    const offset = ARC_LENGTH * (1 - progress);
    if (arc) { arc.style.stroke = phase.color; arc.style.strokeDashoffset = offset; }
    if (glow) { glow.style.stroke = phase.color; glow.style.strokeDashoffset = offset; }
    setText("elapsed-display", formatTime(state.elapsed));
    setText("progress-pct", Math.round(progress * 100) + "%");
    const remaining = Math.max(0, targetSeconds - state.elapsed);
    setText("stat-remaining", Math.floor(remaining / 3600) + "h" + Math.floor((remaining % 3600) / 60) + "m");
    const status = fastingStatus(progress, state.elapsed / 3600, phase.color);
    setText("stat-status", status.text);
    const statusEl = $("stat-status");
    if (statusEl) statusEl.style.color = status.color;
    const bar = $("insulin-bar");
    if (bar) bar.style.width = Math.min(5 + progress * 95, 100) + "%";
    const labels = ["稳定中...", "下降中", "显著改善", "深度改善", "达到峰值"];
    setText("insulin-label", labels[Math.min(Math.floor(progress * 5), 4)]);
    setText("cp-emoji", phase.icon);
    setText("cp-title", phase.title);
    const title = $("cp-title");
    if (title) title.style.color = phase.color;
    setText("cp-desc", phase.desc);
    setText("cp-next", next ? "下一阶段：" + next.icon + " " + next.title + "（" + next.hour + "小时）" : "🎊 已达到最高断食阶段！");
    if (phase.hour !== state.lastPhaseHour) {
      if (state.lastPhaseHour >= 0) showMilestone(phase);
      state.lastPhaseHour = phase.hour;
    }
    const banner = $("complete-banner");
    if (banner) banner.style.display = progress >= 1 ? "block" : "none";
    const endButton = first(".end-btn");
    if (endButton) {
      endButton.classList.toggle("completed", progress >= 1);
      endButton.textContent = progress >= 1 ? "✅ 结束断食（已达标）" : "结束断食";
    }
  }
  function setText(id, value) { const el = $(id); if (el) el.textContent = value; }
  function fastingStatus(progress, elapsedHours, phaseColor) {
    let text = "热身中";
    if (elapsedHours >= 4) text = "脂肪分解";
    if (elapsedHours >= 8) text = "燃脂中";
    if (elapsedHours >= 12) text = "自噬中";
    if (elapsedHours >= 16) text = "深度净化";
    if (progress >= 1) return { text: "目标达成", color: "#fbbf24" };
    return { text, color: phaseColor };
  }
  function showMilestone(phase) {
    clearTimeout(state.milestoneTimerId);
    setText("mt-icon", phase.icon);
    setText("mt-title", phase.title);
    setText("mt-desc", phase.desc);
    const flash = $("milestone-flash");
    const toast = $("milestone-toast");
    if (toast) { toast.style.borderColor = phase.color + "55"; toast.classList.add("show"); }
    if (flash) { flash.style.background = phase.color + "18"; flash.classList.add("show"); setTimeout(() => flash.classList.remove("show"), 600); }
    state.milestoneTimerId = setTimeout(() => toast && toast.classList.remove("show"), 3500);
  }
  function endFast() {
    if (!state.isRunning) return;
    state.fastingRecords.unshift({ id: Date.now(), planLabel: state.selectedPlan.label, planId: state.selectedPlan.id, planHours: state.selectedPlan.hours, duration: state.elapsed, completed: state.elapsed >= state.selectedPlan.hours * 3600, date: dateToISO(new Date()) });
    state.fastingRecords = state.fastingRecords.slice(0, 30);
    saveJSON("fasting_records", state.fastingRecords);
    clearFastingState();
    clearInterval(state.timerId);
    state.isRunning = false;
    state.elapsed = 0;
    state.startTimestamp = null;
    const badge = $("fast-plan-badge-circle");
    if (badge) badge.style.display = "none";
    updateStartButton();
    setText("elapsed-display", "00:00:00");
    setText("progress-pct", "0%");
    const arc = $("arc-progress");
    const glow = $("arc-glow-circle");
    if (arc) arc.style.strokeDashoffset = ARC_LENGTH;
    if (glow) glow.style.strokeDashoffset = ARC_LENGTH;
    renderHistory();
    showScreen("home");
  }

  function showAdjustModal() {
    if (!state.isRunning) return;
    const modal = $("adjust-modal");
    if (modal) modal.style.display = "flex";
    const current = Math.max(0, Math.floor((Date.now() - state.startTimestamp) / 1000));
    const hours = $("adjust-hours");
    const mins = $("adjust-mins");
    if (hours) hours.value = Math.floor(current / 3600);
    if (mins) mins.value = Math.floor((current % 3600) / 60);
    updateAdjustPreview();
    [hours, mins].forEach(input => input && input.addEventListener("input", updateAdjustPreview));
  }
  function hideAdjustModal() {
    const modal = $("adjust-modal");
    if (modal) modal.style.display = "none";
    [$("adjust-hours"), $("adjust-mins")].forEach(input => input && input.removeEventListener("input", updateAdjustPreview));
  }
  function updateAdjustPreview() {
    const h = parseInt($("adjust-hours")?.value || "0", 10) || 0;
    const m = parseInt($("adjust-mins")?.value || "0", 10) || 0;
    const preview = $("adjust-preview");
    if (!preview) return;
    if (h === 0 && m === 0) { preview.textContent = ""; return; }
    const percent = Math.min(Math.round((h * 3600 + m * 60) / (state.selectedPlan.hours * 3600) * 100), 100);
    preview.textContent = "开始时间将调整到 " + h + "小时" + m + "分钟前（进度 " + percent + "%）";
    preview.style.color = "#4a9eff";
  }
  function applyAdjust() {
    const h = parseInt($("adjust-hours")?.value || "0", 10) || 0;
    const m = parseInt($("adjust-mins")?.value || "0", 10) || 0;
    if (h === 0 && m === 0) { alert("请输入已断食时长"); return; }
    state.elapsed = h * 3600 + m * 60;
    state.startTimestamp = Date.now() - state.elapsed * 1000;
    saveFastingState();
    updateFastingUI();
    hideAdjustModal();
  }

  function startClearLP(event) {
    if (event) event.preventDefault();
    state.clearProgress = 0;
    const progress = $("clear-progress");
    const button = $("clear-btn");
    if (progress) progress.style.width = "0%";
    if (button) button.textContent = "继续长按...";
    clearInterval(state.clearTimerId);
    state.clearTimerId = setInterval(() => {
      state.clearProgress += 100 / (3000 / 40);
      if (progress) progress.style.width = Math.min(state.clearProgress, 100) + "%";
      if (state.clearProgress >= 100) {
        cancelClearLP(true);
        if (confirm("确定要清除全部数据吗？\n\n此操作不可恢复，所有断食及体重记录将被删除。")) clearHistory();
        else resetClearButton();
      }
    }, 40);
  }
  function cancelClearLP(completed) {
    clearInterval(state.clearTimerId);
    state.clearTimerId = null;
    if (!completed && state.clearProgress < 100) resetClearButton();
  }
  function resetClearButton() {
    state.clearProgress = 0;
    const progress = $("clear-progress");
    const button = $("clear-btn");
    if (progress) progress.style.width = "0%";
    if (button) button.textContent = "清除全部数据";
  }
  function clearHistory() {
    state.fastingRecords = [];
    state.weightRecords = [];
    state.steadyRecords = [];
    state.activeMeal = null;
    state.goalWeight = 0;
    state.userHeight = 0;
    ["fasting_records", "weight_records", "steady_records", "active_meal", "goal_weight", "user_height", "fasting_state"].forEach(safeRemove);
    resetClearButton();
    renderHistory();
    renderWeightScreen();
    renderSteadyScreen();
  }
  function deleteRecord(id) {
    if (!confirm("确定删除这条记录？")) return;
    state.fastingRecords = state.fastingRecords.filter(record => record.id !== id);
    saveJSON("fasting_records", state.fastingRecords);
    renderHistory();
  }

  function renderWeightScreen() {
    renderBMI();
    renderGoalCard();
    renderWeightList();
    renderWeightChart();
  }
  function showHeightModal() {
    const modal = $("height-modal");
    if (modal) modal.style.display = "flex";
    if (state.userHeight && $("height-input")) $("height-input").value = state.userHeight;
  }
  function hideHeightModal() { const modal = $("height-modal"); if (modal) modal.style.display = "none"; }
  function saveHeight() {
    const value = parseFloat($("height-input")?.value);
    if (!value || value < 100 || value > 250) { alert("请输入有效身高（100–250 cm）"); return; }
    state.userHeight = value;
    safeSet("user_height", value);
    hideHeightModal();
    renderBMI();
  }
  function showGoalModal() {
    const modal = $("goal-modal");
    if (modal) modal.style.display = "flex";
    if (state.goalWeight && $("goal-input")) $("goal-input").value = state.goalWeight;
  }
  function hideGoalModal() { const modal = $("goal-modal"); if (modal) modal.style.display = "none"; }
  function saveGoal() {
    const value = parseFloat($("goal-input")?.value);
    if (!value || value < 20 || value > 300) { alert("请输入有效目标体重"); return; }
    state.goalWeight = value;
    safeSet("goal_weight", value);
    hideGoalModal();
    renderWeightScreen();
  }
  function addWeight() {
    const input = $("weight-input");
    const value = parseFloat(input?.value);
    if (!value || value < 20 || value > 300) { alert("请输入有效体重"); return; }
    state.weightRecords.unshift({ weight: value, date: dateToISO(new Date()), ts: Date.now() });
    state.weightRecords = state.weightRecords.slice(0, 90);
    saveJSON("weight_records", state.weightRecords);
    if (input) input.value = "";
    renderWeightScreen();
  }
  function renderBMI() {
    const latest = state.weightRecords[0];
    const tag = $("bmi-height-tag");
    const height = $("bmi-height-display");
    if (tag) tag.style.display = "flex";
    if (height) height.textContent = state.userHeight ? state.userHeight + " cm" : "点击设置身高";
    if (!latest || !state.userHeight) {
      setText("bmi-val", "--");
      const marker = $("bmi-marker");
      const badge = $("bmi-badge");
      if (marker) marker.style.display = "none";
      if (badge) badge.style.display = "none";
      return;
    }
    const bmi = latest.weight / Math.pow(state.userHeight / 100, 2);
    setText("bmi-val", bmi.toFixed(1));
    const category = bmiCategory(bmi);
    const badge = $("bmi-badge");
    if (badge) badge.style.display = "block";
    setText("bmi-icon", category.icon);
    setText("bmi-badge-lbl", category.label);
    const label = $("bmi-badge-lbl");
    if (label) label.style.color = category.color;
    const marker = $("bmi-marker");
    if (marker) {
      marker.style.display = "block";
      marker.style.left = Math.min(Math.max((bmi - 15) / 20 * 100, 2), 98) + "%";
      marker.style.borderColor = category.color;
      marker.style.boxShadow = "0 0 8px " + category.color;
    }
  }
  function bmiCategory(bmi) {
    if (bmi < 18.5) return { label: "偏轻", color: "#4a9eff", icon: "🪶" };
    if (bmi < 24) return { label: "正常 ✓", color: "#4ade80", icon: "😊" };
    if (bmi < 28) return { label: "超重", color: "#fbbf24", icon: "⚠️" };
    return { label: "肥胖", color: "#ff6060", icon: "🔴" };
  }
  function renderGoalCard() {
    const latest = state.weightRecords[0];
    const display = $("goal-display");
    const diffEl = $("goal-diff");
    if (!state.goalWeight) {
      if (display) display.textContent = "未设置";
      if (diffEl) diffEl.textContent = "";
      return;
    }
    if (display) display.textContent = state.goalWeight + " kg";
    if (!latest) { if (diffEl) diffEl.textContent = ""; return; }
    const diff = Number((latest.weight - state.goalWeight).toFixed(1));
    if (!diffEl) return;
    if (diff > 0) { diffEl.textContent = "还差 " + diff + " kg"; diffEl.style.color = "#22a85a"; }
    else if (diff < 0) { diffEl.textContent = "超出 " + Math.abs(diff) + " kg"; diffEl.style.color = "#4a9eff"; }
    else { diffEl.textContent = "✓ 已达标"; diffEl.style.color = "#4ade80"; }
  }
  function weightRow(record, dayLabel) {
    const index = state.weightRecords.indexOf(record);
    return "<div style='position:relative;display:flex;align-items:center;justify-content:space-between;background:transparent;border:1px solid var(--border);border-radius:14px;padding:12px 14px;margin-bottom:8px;'>" +
      "<div style='font-size:13px;color:var(--text2);'>" + dayLabel + " · " + record.date + "</div>" +
      "<div style='position:absolute;left:55%;transform:translateX(-50%);font-size:18px;font-weight:900;font-family:monospace;pointer-events:none;'>" + record.weight + "<span style='font-size:11px;color:var(--text3);font-weight:400;'> kg</span></div>" +
      trashButton("deleteWeight(" + index + ")") + "</div>";
  }
  function renderWeightList() {
    const list = $("weight-list");
    if (!list) return;
    if (!state.weightRecords.length) {
      list.innerHTML = "<div style='text-align:center;padding:30px;color:#666;'>还没有体重记录</div>";
      const nav = $("weight-nav");
      if (nav) nav.innerHTML = "";
      return;
    }
    const rows = [];
    if (state.weightWeekOffset === 0) {
      const latest = isoToLocalDate(state.weightRecords[0].date);
      for (let index = 0; index < 7; index++) {
        const d = new Date(latest);
        d.setDate(latest.getDate() - index);
        const iso = dateToISO(d);
        const dayLabel = WEEK_DAYS[(d.getDay() + 6) % 7];
        const records = state.weightRecords.filter(record => record.date === iso);
        rows.push(records.length ? records.map(record => weightRow(record, dayLabel)).join("") : blankRow(dayLabel, iso));
      }
      const cutoff = new Date(latest);
      cutoff.setDate(latest.getDate() - 6);
      updateWeightNav(state.weightRecords.some(record => record.date < dateToISO(cutoff)), false, "第 " + isoWeek(latest) + " 周");
    } else {
      const bounds = weekBounds(state.weightWeekOffset);
      const mondayISO = dateToISO(bounds.monday);
      DAY_ORDER_DESC.forEach(offset => {
        const d = new Date(bounds.monday);
        d.setDate(bounds.monday.getDate() + offset);
        const iso = dateToISO(d);
        const records = state.weightRecords.filter(record => record.date === iso);
        rows.push(records.length ? records.map(record => weightRow(record, WEEK_DAYS[offset])).join("") : blankRow(WEEK_DAYS[offset], iso));
      });
      const earliest = state.weightRecords.length ? state.weightRecords[state.weightRecords.length - 1].date : "";
      updateWeightNav(earliest < mondayISO, true, "第 " + isoWeek(bounds.monday) + " 周");
    }
    list.innerHTML = rows.join("");
  }
  function updateWeightNav(hasOlder, hasNewer, label) {
    const nav = $("weight-nav");
    if (!nav) return;
    const center = label ? "<span style='font-size:12px;font-weight:700;color:var(--text2);padding:0 4px;'>" + label + "</span>" : "";
    nav.innerHTML = pagerButton(hasNewer, "weightPrev()", "‹ 上一页") + center + pagerButton(hasOlder, "weightNext()", "下一页 ›");
  }
  function deleteWeight(index) {
    if (!confirm("确定删除这条记录？")) return;
    state.weightRecords.splice(index, 1);
    saveJSON("weight_records", state.weightRecords);
    renderWeightScreen();
  }
  function setChartPeriod(days) {
    state.chartPeriod = days;
    ["7", "30", "all"].forEach(key => {
      const button = $("chart-btn-" + key);
      const value = key === "all" ? 0 : parseInt(key, 10);
      if (button) button.classList.toggle("active", value === days);
    });
    renderWeightChart();
  }
  function renderWeightChart() {
    const canvas = $("weight-chart");
    const empty = $("weight-chart-empty");
    const trend = $("weight-chart-trend");
    if (!canvas) return;
    const sorted = [...state.weightRecords].reverse();
    const data = state.chartPeriod === 0 ? sorted : sorted.slice(-state.chartPeriod);
    if (data.length < 2) {
      canvas.style.display = "none";
      if (empty) empty.style.display = "block";
      if (trend) trend.textContent = "";
      return;
    }
    canvas.style.display = "block";
    if (empty) empty.style.display = "none";
    drawWeightTrend(canvas, data, trend);
  }
  function drawWeightTrend(canvas, data, trend) {
    const first = data[0].weight;
    const last = data[data.length - 1].weight;
    const diff = Number((last - first).toFixed(1));
    if (trend) {
      const color = diff < 0 ? "#4ade80" : diff > 0 ? "#f97316" : "#888";
      const arrow = diff < 0 ? "↓" : diff > 0 ? "↑" : "→";
      trend.innerHTML = "<span style='color:" + color + ";font-weight:700;'>" + arrow + " " + Math.abs(diff) + " kg</span> <span style='color:#555;'>/ " + data.length + "天</span>";
    }
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = 160;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const pad = { top: 10, right: 16, bottom: 28, left: 40 };
    const weights = data.map(record => record.weight);
    const min = Math.floor(Math.min(...weights));
    const max = Math.ceil(Math.max(...weights));
    const range = Math.max(max - min, 1);
    const xStep = (width - pad.left - pad.right) / Math.max(data.length - 1, 1);
    const yScale = (height - pad.top - pad.bottom) / range;
    const xOf = index => pad.left + index * xStep;
    const yOf = value => height - pad.bottom - (value - min) * yScale;
    ctx.clearRect(0, 0, width, height);
    if (state.goalWeight && state.goalWeight >= min && state.goalWeight <= max) drawGoalLine(ctx, width, pad, yOf);
    const gradient = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
    gradient.addColorStop(0, "rgba(74,158,255,0.28)");
    gradient.addColorStop(1, "rgba(74,158,255,0.02)");
    ctx.beginPath();
    data.forEach((record, index) => index === 0 ? ctx.moveTo(xOf(index), yOf(record.weight)) : ctx.lineTo(xOf(index), yOf(record.weight)));
    ctx.lineTo(xOf(data.length - 1), height - pad.bottom);
    ctx.lineTo(xOf(0), height - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = "#4a9eff";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    data.forEach((record, index) => index === 0 ? ctx.moveTo(xOf(index), yOf(record.weight)) : ctx.lineTo(xOf(index), yOf(record.weight)));
    ctx.stroke();
    if (data.length <= 30) data.forEach((record, index) => { ctx.beginPath(); ctx.arc(xOf(index), yOf(record.weight), data.length > 15 ? 2 : 3, 0, Math.PI * 2); ctx.fillStyle = "#4a9eff"; ctx.fill(); });
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    for (let value = min; value <= max; value++) {
      const y = yOf(value);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(128,128,128,0.12)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#555";
      ctx.fillText(value, pad.left - 4, y + 4);
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "#555";
    ctx.font = "9px sans-serif";
    ctx.fillText(data[0].date.slice(5), xOf(0), height - pad.bottom + 14);
    ctx.fillText(data[data.length - 1].date.slice(5), xOf(data.length - 1), height - pad.bottom + 14);
  }
  function drawGoalLine(ctx, width, pad, yOf) {
    const y = yOf(state.goalWeight);
    ctx.beginPath();
    ctx.strokeStyle = "rgba(74,222,128,0.35)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(74,222,128,0.65)";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("目标 " + state.goalWeight, pad.left + 2, y - 4);
  }

  function startSteadyTicker() {
    clearInterval(state.steadyTimerId);
    state.steadyTimerId = setInterval(renderSteadyTick, 1000);
  }
  function startSteadyKnowledgeTicker() {
    clearInterval(state.steadyKnowledgeTimerId);
    state.steadyKnowledgeTimerId = setInterval(() => {
      if (SCREEN_ORDER[state.currentScreenIndex] !== "steady") return;
      nextSteadyKnowledge();
    }, 8000);
  }
  function nextSteadyKnowledge() {
    pickNextSteadyKnowledge();
    renderSteadyKnowledge();
  }
  function refillSteadyKnowledgeQueue() {
    state.steadyKnowledgeQueue = STEADY_KNOWLEDGE_LIST.map((_, index) => index);
    for (let index = state.steadyKnowledgeQueue.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [state.steadyKnowledgeQueue[index], state.steadyKnowledgeQueue[swapIndex]] = [state.steadyKnowledgeQueue[swapIndex], state.steadyKnowledgeQueue[index]];
    }
    if (state.steadyKnowledgeQueue.length > 1 && state.steadyKnowledgeQueue[0] === state.steadyKnowledgeIndex) {
      [state.steadyKnowledgeQueue[0], state.steadyKnowledgeQueue[1]] = [state.steadyKnowledgeQueue[1], state.steadyKnowledgeQueue[0]];
    }
  }
  function pickNextSteadyKnowledge() {
    if (!state.steadyKnowledgeQueue.length) refillSteadyKnowledgeQueue();
    state.steadyKnowledgeIndex = state.steadyKnowledgeQueue.shift();
  }
  function renderSteadyKnowledge() {
    const text = $("steady-knowledge-text");
    if (!text) return;
    if (state.steadyKnowledgeIndex < 0) pickNextSteadyKnowledge();
    const item = STEADY_KNOWLEDGE_LIST[state.steadyKnowledgeIndex % STEADY_KNOWLEDGE_LIST.length];
    text.innerHTML = item[0] + "<br>" + item[1];
  }
  function renderSteadyTick() {
    renderSteadyStatus();
    renderSteadyStats();
  }
  function recordMeal() {
    stopReminderSound();
    primeReminderSound();
    const now = Date.now();
    state.activeMeal = {
      id: now,
      mealAt: now,
      remindAt: now + MEAL_REMINDER_MINUTES * 60 * 1000,
      alerted: false,
      status: "waiting",
      recordId: null
    };
    saveActiveMeal();
    renderSteadyScreen();
  }
  function completeMealReminder() {
    if (!state.activeMeal) return;
    stopReminderSound();
    hideSteadyAlertModal();
    ensureSteadyRecord("ended");
    state.activeMeal = null;
    saveActiveMeal();
    renderSteadyScreen();
  }
  function ackMealReminder() {
    if (!state.activeMeal) return;
    state.activeMeal.alerted = true;
    ensureSteadyRecord("reminded");
    saveActiveMeal();
    stopReminderSound();
    hideSteadyAlertModal();
    renderSteadyScreen();
  }
  function ensureSteadyRecord(status) {
    if (!state.activeMeal) return null;
    let record = state.steadyRecords.find(item => item.id === state.activeMeal.recordId);
    if (!record) {
      record = {
        id: Date.now(),
        date: dateToISO(new Date()),
        mealAt: state.activeMeal.mealAt,
        remindedAt: Date.now(),
        status: "reminded",
        completed: true
      };
      state.steadyRecords.unshift(record);
      state.steadyRecords = state.steadyRecords.slice(0, 90);
      state.activeMeal.recordId = record.id;
    }
    if (status === "ended") {
      record.status = "ended";
      record.endedAt = Date.now();
    }
    saveJSON("steady_records", state.steadyRecords);
    return record;
  }
  function finishSteadyCycleIfNeeded(now) {
    const meal = state.activeMeal;
    if (!meal) return false;
    const elapsedMinutes = Math.floor((now - meal.mealAt) / 60000);
    if (elapsedMinutes < MEAL_OBSERVE_MINUTES) return false;
    if (meal.recordId) {
      const record = state.steadyRecords.find(item => item.id === meal.recordId);
      if (record) {
        record.status = "ended";
        record.endedAt = record.endedAt || now;
        saveJSON("steady_records", state.steadyRecords);
      }
    }
    stopReminderSound();
    hideSteadyAlertModal();
    state.activeMeal = null;
    saveActiveMeal();
    return true;
  }
  function cancelStableMeal() {
    stopReminderSound();
    hideSteadyAlertModal();
    state.activeMeal = null;
    saveActiveMeal();
    renderSteadyScreen();
  }
  function saveActiveMeal() {
    if (state.activeMeal) saveJSON("active_meal", state.activeMeal);
    else safeRemove("active_meal");
  }
  function renderSteadyScreen() {
    renderSteadyStatus();
    renderSteadyStats();
    renderSteadyKnowledge();
    renderSteadyList();
  }
  function renderSteadyStatus() {
    const title = $("steady-status-title");
    const timer = $("steady-timer");
    const subtitle = $("steady-subtitle");
    const primary = $("steady-primary");
    setText("steady-reminder-label", "餐后" + MEAL_REMINDER_MINUTES + "分钟提醒");
    setSteadyStep("meal");
    if (!timer || !primary) return;
    const meal = state.activeMeal;
    if (!meal) {
      setSteadyStep("meal");
      if (title) title.textContent = "饭后" + MEAL_REMINDER_MINUTES + "分钟提醒";
      timer.textContent = formatMinuteTimer(MEAL_REMINDER_MINUTES * 60 * 1000);
      if (subtitle) subtitle.innerHTML = "饭后30分钟提醒，帮助你把握餐后稳糖观察窗口。";
      primary.textContent = "开始餐后" + MEAL_REMINDER_MINUTES + "分钟提醒";
      primary.setAttribute("onclick", "recordMeal()");
      setSteadyPrimaryState("start");
      updateSteadyGlucoseCurve(0, "未开始");
      return;
    }
    const now = Date.now();
    if (finishSteadyCycleIfNeeded(now)) {
      setSteadyStep("meal");
      if (title) title.textContent = "本轮观察已结束";
      timer.textContent = formatMinuteTimer(MEAL_REMINDER_MINUTES * 60 * 1000);
      if (subtitle) subtitle.innerHTML = "餐后120分钟观察周期已自动结束，不需要你手动收尾。";
      primary.textContent = "开始下一餐提醒";
      primary.setAttribute("onclick", "recordMeal()");
      setSteadyPrimaryState("start");
      updateSteadyGlucoseCurve(MEAL_OBSERVE_MINUTES);
      renderSteadyStats();
      renderSteadyList();
      return;
    }
    const wait = meal.remindAt - now;
    const elapsedMinutes = Math.max(0, Math.floor((now - meal.mealAt) / 60000));
    if (wait > 0) {
      setSteadyStep("wait");
      if (title) title.textContent = "饭后" + MEAL_REMINDER_MINUTES + "分钟提醒";
      timer.textContent = formatMinuteTimer(wait);
      if (subtitle) subtitle.innerHTML = "饭后30分钟提醒，帮助你把握餐后稳糖观察窗口。";
      primary.textContent = "取消提醒";
      primary.setAttribute("onclick", "cancelStableMeal()");
      setSteadyPrimaryState("wait");
      updateSteadyGlucoseCurve(elapsedMinutes);
      return;
    }
    if (!meal.alerted) {
      meal.alerted = true;
      saveActiveMeal();
      playReminderSound();
      showSteadyAlertModal();
    } else if (state.reminderSoundTimerId) {
      playReminderSound();
      showSteadyAlertModal();
    }
    setSteadyStep("walk");
    if (title) title.textContent = "餐后提醒时间到";
    timer.textContent = formatMinuteTimer(now - meal.mealAt);
    if (subtitle) subtitle.innerHTML = meal.recordId ? "已记录提醒。你可以去活动，后续观察会在120分钟自动结束。" : "已经到达餐后30分钟提醒时间，确认后会记入稳糖记录。";
    primary.textContent = "取消这次观察";
    primary.setAttribute("onclick", "cancelStableMeal()");
    setSteadyPrimaryState("ready");
    updateSteadyGlucoseCurve(elapsedMinutes);
  }
  function getSteadyCurvePoint(minutes) {
    const segments = [
      { from: 0, to: 30, p0: [8, 104], p1: [30, 100], p2: [55, 76], p3: [94, 54] },
      { from: 30, to: 60, p0: [94, 54], p1: [120, 38], p2: [150, 24], p3: [180, 45] },
      { from: 60, to: 120, p0: [180, 45], p1: [210, 66], p2: [286, 88], p3: [352, 106] }
    ];
    const clamped = Math.max(0, Math.min(120, minutes));
    for (const segment of segments) {
      if (clamped <= segment.to) return cubicPoint(segment, (clamped - segment.from) / (segment.to - segment.from));
    }
    return { x: 352, y: 99 };
  }
  function cubicPoint(segment, t) {
    const mt = 1 - t;
    const x = mt * mt * mt * segment.p0[0] + 3 * mt * mt * t * segment.p1[0] + 3 * mt * t * t * segment.p2[0] + t * t * t * segment.p3[0];
    const y = mt * mt * mt * segment.p0[1] + 3 * mt * mt * t * segment.p1[1] + 3 * mt * t * t * segment.p2[1] + t * t * t * segment.p3[1];
    return { x, y };
  }
  function getSteadyGlucoseMechanism(minutes, fallbackPhase) {
    if (fallbackPhase === "未开始") {
      return { title: "", desc: "记录餐后时间<br>观察身体反应", color: "#16a05b" };
    }
    if (minutes < 10) {
      return { title: "", desc: "碳水开始分解<br>葡萄糖进入血液", color: "#16a05b" };
    }
    if (minutes < 30) {
      return { title: "", desc: "吸收速度加快<br>血糖继续上升", color: "#16a05b" };
    }
    if (minutes < 45) {
      return { title: "", desc: "血糖接近高点<br>胰岛素加速分泌", color: "#f97316" };
    }
    if (minutes < 60) {
      return { title: "", desc: "血糖处在高点<br>胰岛素促进摄糖", color: "#f97316" };
    }
    if (minutes < 75) {
      return { title: "", desc: "肌肉肝脏摄糖<br>血糖开始下降", color: "#4a9eff" };
    }
    if (minutes < 90) {
      return { title: "", desc: "胰岛素作用增强<br>血糖快速下降", color: "#4a9eff" };
    }
    if (minutes < 120) {
      return { title: "", desc: "吸收逐渐放缓<br>接近餐前水平", color: "#16a05b" };
    }
    return { title: "", desc: "接近餐前水平<br>观察是否回稳", color: "#16a05b" };
  }
  function getSteadyLabelPlacement(minutes, point, lineCount) {
    const labelWidth = 96;
    const labelHeight = lineCount > 2 ? 37 : 24;
    const verticalGap = 16;
    const minX = labelWidth / 2 - 18;
    const maxX = 348 - labelWidth / 2;
    const earlyNudgeX = 0;
    const earlyNudgeY = minutes <= 1 ? 16 : 0;
    const x = Math.max(minX, Math.min(maxX, point.x - earlyNudgeX));
    const y = point.y - labelHeight - verticalGap - earlyNudgeY;
    return {
      x,
      y: Math.max(2, Math.min(104 - labelHeight, y))
    };
  }
  function updateSteadyGlucoseCurve(minutes, fallbackPhase) {
    const rounded = Math.max(0, Math.floor(minutes || 0));
    const point = getSteadyCurvePoint(rounded);
    const mechanism = getSteadyGlucoseMechanism(rounded, fallbackPhase);
    const dot = $("steady-glucose-dot");
    const pill = $("steady-glucose-pill");
    const curve = $("steady-glucose-curve");
    if (dot) {
      dot.setAttribute("cx", point.x.toFixed(1));
      dot.setAttribute("cy", point.y.toFixed(1));
    }
    if (pill) pill.innerHTML = "<strong>" + mechanism.title + "</strong><span>" + mechanism.desc + "</span>";
    if (curve) {
      const phaseColor = mechanism.color;
      const lineCount = mechanism.desc.split("<br>").length;
      const label = getSteadyLabelPlacement(rounded, point, lineCount);
      curve.style.setProperty("--steady-current-color", phaseColor);
      curve.style.setProperty("--marker-x", (label.x / 360 * 100).toFixed(2) + "%");
      curve.style.setProperty("--marker-y", (label.y / 160 * 100).toFixed(2) + "%");
      curve.style.setProperty("--marker-transform", "translate(-50%, 0)");
    }
  }
  function setSteadyProgress(el, pct) {
    if (!el) return;
    const value = Math.max(0, Math.min(100, pct));
    el.style.background = "linear-gradient(90deg, var(--blue) " + value + "%, rgba(74,158,255,0.18) " + value + "%)";
  }
  function showMealReminderModal() {
    const modal = $("meal-reminder-modal");
    const minInput = $("meal-reminder-min-input");
    const secInput = $("meal-reminder-sec-input");
    const elapsedSeconds = state.activeMeal ? Math.max(0, Math.floor((Date.now() - state.activeMeal.mealAt) / 1000)) : 0;
    if (minInput) minInput.value = Math.floor(elapsedSeconds / 60);
    if (secInput) secInput.value = elapsedSeconds % 60;
    if (modal) modal.style.display = "flex";
    if (minInput) setTimeout(() => { minInput.focus(); minInput.select(); }, 30);
  }
  function hideMealReminderModal() {
    const modal = $("meal-reminder-modal");
    if (modal) modal.style.display = "none";
  }
  function showSteadyAlertModal() {
    const modal = $("steady-alert-modal");
    if (modal) modal.style.display = "flex";
  }
  function hideSteadyAlertModal() {
    const modal = $("steady-alert-modal");
    if (modal) modal.style.display = "none";
  }
  function saveMealReminder() {
    const minutes = parseInt($("meal-reminder-min-input")?.value || "0", 10);
    const seconds = parseInt($("meal-reminder-sec-input")?.value || "0", 10);
    if (Number.isNaN(minutes) || minutes < 0 || minutes > 180) { alert("请输入 0–180 分钟"); return; }
    if (Number.isNaN(seconds) || seconds < 0 || seconds > 59) { alert("请输入 0–59 秒"); return; }
    const now = Date.now();
    const mealAt = now - (minutes * 60 + seconds) * 1000;
    state.activeMeal = {
      id: state.activeMeal?.id || now,
      mealAt,
      remindAt: mealAt + MEAL_REMINDER_MINUTES * 60 * 1000,
      alerted: false,
      status: "waiting",
      recordId: null
    };
    saveActiveMeal();
    hideMealReminderModal();
    renderSteadyScreen();
  }
  function primeReminderSound() {
    const player = getReminderPlayer();
    if (player) {
      player.load();
      player.play()
        .then(() => {
          player.pause();
          player.currentTime = 0;
        })
        .catch(() => {});
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!state.reminderAudio) state.reminderAudio = new AudioContext();
    if (state.reminderAudio.state === "suspended") state.reminderAudio.resume().catch(() => {});
  }
  function getReminderPlayer() {
    if (!state.reminderPlayer && typeof Audio !== "undefined") {
      state.reminderPlayer = new Audio("./reminder.mp3");
      state.reminderPlayer.preload = "auto";
      state.reminderPlayer.loop = true;
    }
    return state.reminderPlayer;
  }
  function playReminderSound() {
    if (state.reminderSoundTimerId) return;
    playReminderPattern();
    if (state.reminderPlayer) {
      state.reminderSoundTimerId = true;
    } else {
      state.reminderSoundTimerId = setInterval(playReminderPattern, 4000);
    }
    clearTimeout(state.reminderAutoStopTimerId);
    state.reminderAutoStopTimerId = setTimeout(stopReminderSound, 45000);
  }
  function stopReminderSound() {
    if (state.reminderSoundTimerId) {
      if (state.reminderSoundTimerId !== true) clearInterval(state.reminderSoundTimerId);
      state.reminderSoundTimerId = null;
    }
    clearTimeout(state.reminderAutoStopTimerId);
    state.reminderAutoStopTimerId = null;
    const player = getReminderPlayer();
    if (player) {
      player.pause();
      player.currentTime = 0;
    }
  }
  function playReminderPattern() {
    const player = getReminderPlayer();
    if (player) {
      player.currentTime = 0;
      const playPromise = player.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(playFallbackReminderPattern);
      }
      return;
    }
    playFallbackReminderPattern();
  }
  function playFallbackReminderPattern() {
    try {
      primeReminderSound();
      const ctx = state.reminderAudio;
      if (!ctx) return;
      [0, 0.22, 0.44].forEach(offset => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, ctx.currentTime + offset);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.16);
        oscillator.connect(gain).connect(ctx.destination);
        oscillator.start(ctx.currentTime + offset);
        oscillator.stop(ctx.currentTime + offset + 0.18);
      });
    } catch (_) {}
  }
  function setSteadyPrimaryState(name) {
    const primary = $("steady-primary");
    if (!primary) return;
    primary.classList.remove("state-start", "state-wait", "state-ready", "state-walking");
    primary.classList.add("state-" + name);
  }
  function setSteadyStep(step) {
    ["meal", "wait", "walk"].forEach(name => {
      const el = $("steady-step-" + name);
      if (el) el.classList.toggle("active", name === step);
    });
  }
  function renderSteadyStats() {
    const todayEl = $("steady-today");
    const streakEl = $("steady-streak");
    if (!todayEl || !streakEl) return;
    const today = dateToISO(new Date());
    const todayRecords = state.steadyRecords.filter(record => record.date === today && record.completed);
    todayEl.textContent = todayRecords.length;
    streakEl.textContent = calcSteadyStreak();
  }
  function renderSteadyList() {
    const list = $("steady-list");
    if (!list) return;
    if (!state.steadyRecords.length) {
      list.innerHTML = "<div style='text-align:center;padding:30px;color:#666;'>还没有稳糖记录</div>";
      return;
    }
    list.innerHTML = state.steadyRecords.slice(0, 14).map(record => {
      const date = record.date || dateToISO(new Date(record.completedAt || record.mealAt || Date.now()));
      const mealTime = timeHHMM(record.mealAt);
      return "<div class='rec-item'>" +
        "<div><div class='rec-left'>" + date + " · " + mealTime + " 提醒</div></div>" +
        "<div style='display:flex;align-items:center;gap:10px;flex-shrink:0;'><span class='rec-badge badge-ok'>已提醒</span>" + trashButton("deleteSteadyRecord(" + record.id + ")") + "</div></div>";
    }).join("");
  }
  function deleteSteadyRecord(id) {
    state.steadyRecords = state.steadyRecords.filter(record => record.id !== id);
    saveJSON("steady_records", state.steadyRecords);
    renderSteadyScreen();
  }
  function calcSteadyStreak() {
    const dates = [...new Set(state.steadyRecords.filter(record => record.completed).map(record => record.date))].sort().reverse();
    if (!dates.length) return 0;
    const today = dayNumber(dateToISO(new Date()));
    const startOffset = today - dayNumber(dates[0]);
    if (startOffset > 1) return 0;
    let streak = 0;
    for (let index = 0; index < dates.length; index++) {
      if (dayNumber(dates[index]) !== today - startOffset - index) break;
      streak += 1;
    }
    return streak;
  }
  function formatMinuteTimer(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    return pad(Math.floor(total / 60)) + ":" + pad(total % 60);
  }
  function timeHHMM(ts) {
    if (!ts) return "—:—";
    const d = new Date(ts);
    return pad(d.getHours()) + ":" + pad(d.getMinutes());
  }
  function isToday(iso) {
    return iso === dateToISO(new Date());
  }

  function showScreen(name) {
    const index = SCREEN_ORDER.indexOf(name);
    if (index < 0) return;
    state.currentScreenIndex = index;
    const wrap = $("screen-wrap");
    if (wrap) wrap.style.transform = "translateX(-" + index * 20 + "%)";
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    const nav = $("nav-" + name);
    if (nav) nav.classList.add("active");
    if (name === "history") renderHistory();
    if (name === "weight") renderWeightScreen();
    if (name === "steady") renderSteadyScreen();
    if (name === "fasting" && state.isRunning) updateFastingUI();
  }
  function initSwipe() {
    const app = $("app");
    if (!app || app.dataset.swipeReady) return;
    app.dataset.swipeReady = "1";
    let startX = 0, startY = 0, startAt = 0, swiping = false;
    app.addEventListener("touchstart", event => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      startAt = Date.now();
      swiping = false;
    }, { passive: true });
    app.addEventListener("touchmove", event => {
      const dx = event.touches[0].clientX - startX;
      const dy = event.touches[0].clientY - startY;
      swiping = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
    }, { passive: true });
    app.addEventListener("touchend", event => {
      if (!swiping) return;
      const dx = event.changedTouches[0].clientX - startX;
      const dy = event.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 2 || Date.now() - startAt > 400) return;
      const nextIndex = dx < 0 ? state.currentScreenIndex + 1 : state.currentScreenIndex - 1;
      if (nextIndex >= 0 && nextIndex < SCREEN_ORDER.length) showScreen(SCREEN_ORDER[nextIndex]);
    }, { passive: true });
  }

  function rotateTips() {
    setText("tip-text", TIP_LIST[state.tipIndex]);
    clearTimeout(state.tipTimerId);
    state.tipTimerId = setTimeout(() => {
      state.tipIndex = (state.tipIndex + 1) % TIP_LIST.length;
      rotateTips();
    }, 6000);
  }
  function autoLight() {
    const hour = new Date().getHours();
    return hour >= 8 && hour < 20;
  }
  function applyTheme() {
    const button = $("theme-btn");
    const meta = document.querySelector("meta[name='theme-color']");
    const light = state.themeMode === "auto" ? autoLight() : state.themeMode === "light";
    if (button) {
      button.textContent = state.themeMode === "auto" ? "🌓" : (light ? "☀️" : "🌙");
      button.title = state.themeMode === "auto" ? "自动模式" : (light ? "白天模式" : "夜晚模式");
    }
    document.body.classList.toggle("light", light);
    if (meta) meta.content = light ? "#ffffff" : "#080b14";
  }
  function toggleTheme() {
    if (state.themeHoldTriggered) {
      state.themeHoldTriggered = false;
      return;
    }
    const next = { auto: "dark", dark: "light", light: "auto" };
    state.themeMode = next[state.themeMode] || "auto";
    safeSet("themeMode", state.themeMode);
    applyTheme();
  }
  function startThemeHold() {
    clearTimeout(state.themeHoldTimerId);
    state.themeHoldTriggered = false;
    state.themeHoldTimerId = setTimeout(() => {
      state.themeMode = "auto";
      state.themeHoldTriggered = true;
      safeSet("themeMode", state.themeMode);
      applyTheme();
    }, 650);
  }
  function endThemeHold() {
    clearTimeout(state.themeHoldTimerId);
  }

  function exportData() {
    const data = { version: "1.4", exportDate: new Date().toLocaleString("zh-CN"), fastingRecords: state.fastingRecords, weightRecords: state.weightRecords, steadyRecords: state.steadyRecords, goalWeight: state.goalWeight, userHeight: state.userHeight };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const d = new Date();
    link.href = url;
    link.download = "断食守护备份_" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + ".json";
    link.click();
    URL.revokeObjectURL(url);
  }
  function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.version || !data.fastingRecords) { alert("文件格式不正确，请选择正确的备份文件"); return; }
        if (!confirm("确定要导入备份？\n断食记录：" + data.fastingRecords.length + " 条\n体重记录：" + (data.weightRecords?.length || 0) + " 条\n稳糖记录：" + (data.steadyRecords?.length || 0) + " 条\n\n⚠️ 这将覆盖当前所有数据")) return;
        state.fastingRecords = normalizeFastingRecords(data.fastingRecords || []);
        state.weightRecords = normalizeWeightRecords(data.weightRecords || []);
        state.steadyRecords = normalizeSteadyRecords(data.steadyRecords || []);
        state.goalWeight = data.goalWeight || 0;
        state.userHeight = data.userHeight || 0;
        saveJSON("fasting_records", state.fastingRecords);
        saveJSON("weight_records", state.weightRecords);
        saveJSON("steady_records", state.steadyRecords);
        safeSet("goal_weight", state.goalWeight);
        safeSet("user_height", state.userHeight);
        renderHistory();
        renderWeightScreen();
        renderSteadyScreen();
        alert("✅ 导入成功！");
      } catch (_) { alert("导入失败，文件可能已损坏"); }
    };
    reader.readAsText(file);
    event.target.value = "";
  }
  function installApp() {
    if (state.deferredPrompt) {
      state.deferredPrompt.prompt();
      state.deferredPrompt.userChoice.then(() => { state.deferredPrompt = null; dismissInstall(); });
      return;
    }
    alert("请点击浏览器菜单（⋮），选择\"添加到主屏幕\"即可安装！");
    dismissInstall();
  }
  function dismissInstall() { const banner = $("install-banner"); if (banner) banner.style.display = "none"; }

  exposeActions();

  let booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    try {
      init();
    } catch (error) {
      console.error("断食守护初始化失败", error);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") restoreTimerFromStorage(); });
  window.addEventListener("pageshow", event => { if (event.persisted) restoreTimerFromStorage(); });
  window.addEventListener("focus", () => { if (state.isRunning && state.startTimestamp) state.elapsed = Math.max(0, Math.floor((Date.now() - state.startTimestamp) / 1000)); });
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    state.deferredPrompt = event;
    setTimeout(() => { const banner = $("install-banner"); if (banner) banner.style.display = "flex"; }, 3000);
  });
  if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
    try { navigator.serviceWorker.register("./sw.js").catch(() => {}); } catch (_) {}
  }
  setInterval(() => { if (state.themeMode === "auto") applyTheme(); }, 60000);

  function exposeActions() {
    Object.assign(window, {
      selectPlan, startFast, endFast, showAdjustModal, hideAdjustModal, applyAdjust,
      startClearLP, cancelClearLP, clearHistory, deleteRecord,
      showScreen, toggleTheme, startThemeHold, endThemeHold, installApp, dismissInstall,
      showHeightModal, hideHeightModal, saveHeight, showGoalModal, hideGoalModal, saveGoal,
      showMealReminderModal, hideMealReminderModal, saveMealReminder,
      addWeight, deleteWeight, setChartPeriod, exportData, importData,
      recordMeal, completeMealReminder, cancelStableMeal,
      renderHistoryPage,
      historyPrev: () => { state.historyWeekOffset -= 1; renderHistoryPage(); },
      historyNext: () => { state.historyWeekOffset += 1; renderHistoryPage(); },
      weightPrev: () => { state.weightWeekOffset -= 1; renderWeightList(); },
      weightNext: () => { state.weightWeekOffset += 1; renderWeightList(); },
      jumpWeightToDate: () => {}
    });
  }
})();
