# 项目目录说明

本文记录当前目录的项目结构、关键文件和后续维护注意事项，方便之后继续工作时快速进入上下文。

## 基本情况

- 项目根目录：`/Users/pcbiao/Documents/Codex/断食守护健康`
- 当前主应用目录：`安卓版/`
- 项目类型：纯前端移动端/PWA 应用，无构建工具、无 `package.json`、无依赖安装步骤。
- 版本标识：应用标题、PWA 配置、缓存名和单文件版都指向 `v.2.2.1`。
- Git 状态：根目录是 Git 仓库；项目说明统一维护在根目录 `AGENTS.md`。
- `.gitignore` 当前只忽略 `.DS_Store`。
- 新对话继续工作时，应先阅读本文件，再按需查看 `安卓版/` 下的具体源码。

## 目录结构

```text
断食守护健康/
├── .git/
├── .gitignore
├── AGENTS.md
└── 安卓版/
    ├── README.md
    ├── icon.svg
    ├── index.html
    ├── manifest.webmanifest
    ├── reminder.mp3
    ├── script.js
    ├── styles.css
    ├── sw.js
    └── 断食守护健康-v2.2.1.html
```

## 核心文件

- `安卓版/index.html`：多文件版入口，包含五个主屏幕、底部导航、弹窗、PWA 安装提示和脚本引用。
- `安卓版/styles.css`：页面样式，使用 CSS 变量管理深色/浅色主题，主要面向手机宽度，`#app` 最大宽度为 480px。
- `安卓版/script.js`：全部业务逻辑，使用立即执行函数包裹，通过 `exposeActions()` 暴露给 HTML 内联事件。
- `安卓版/manifest.webmanifest`：PWA manifest，`start_url` 指向 `./index.html`，使用 `icon.svg`。
- `安卓版/sw.js`：Service Worker 离线缓存，缓存名为 `fasting-guard-v2.2.1`。
- `安卓版/reminder.mp3`：多文件版稳糖提醒铃声。
- `安卓版/断食守护健康-v2.2.1.html`：单文件测试/分发版，已内嵌稳糖提醒铃声。
- `安卓版/README.md`：说明目录用途和两种形态：多文件开发/PWA 版、单文件测试/分发版。

## 应用功能结构

`index.html` 的主界面通过 `#screen-wrap` 横向排列五个屏幕：

1. `screen-home`：主页，选择断食方案、查看健康阶段、开始断食。
2. `screen-fasting`：断食计时页，圆环进度、目标/剩余/状态、胰岛素稳定指数、当前阶段、结束断食。
3. `screen-weight`：体重追踪页，BMI、身高、目标体重、体重记录、趋势图。
4. `screen-steady`：稳糖页，餐后 30 分钟提醒、观察进度、稳糖知识、餐后记录。
5. `screen-history`：记录页，断食时长图、统计概览、历史记录、数据导入导出、长按清除全部数据。

底部导航项顺序由 `script.js` 的 `SCREEN_ORDER` 控制：

```js
["home", "fasting", "weight", "steady", "history"]
```

## 主要数据与状态

`script.js` 使用 `localStorage` 保存用户数据；不可用时回退到内存 Map。

主要存储键：

- `fasting_records`：断食历史记录。
- `weight_records`：体重记录。
- `steady_records`：稳糖/餐后提醒记录。
- `active_meal`：当前进行中的餐后提醒。
- `goal_weight`：目标体重。
- `user_height`：用户身高。
- `themeMode`：主题模式，取值包含 `auto`、`dark`、`light`。
- `fasting_state`：正在进行的断食状态，同时尝试写入 cookie，便于恢复计时。

导出备份由 `exportData()` 生成 JSON，导入由 `importData(event)` 覆盖当前本地记录。

## 业务逻辑位置

`安卓版/script.js` 中的重要模块大致如下：

- 常量配置：`PLAN_LIST`、`PHASE_LIST`、`TIP_LIST`、`STEADY_KNOWLEDGE_BASE`。
- 初始化：`init()`、`boot()`、`bindDeclarativeEvents()`、`exposeActions()`。
- 断食：`startFast()`、`startTimer()`、`updateFastingUI()`、`endFast()`、`showAdjustModal()`、`applyAdjust()`。
- 历史记录：`renderHistory()`、`renderHeatmap()`、`renderHistoryPage()`、`deleteRecord()`、`clearHistory()`。
- 体重：`renderWeightScreen()`、`addWeight()`、`renderBMI()`、`renderWeightChart()`、`deleteWeight()`。
- 稳糖：`recordMeal()`、`completeMealReminder()`、`ackMealReminder()`、`renderSteadyScreen()`、`updateSteadyGlucoseCurve()`。
- 铃声：`primeReminderSound()`、`playReminderSound()`、`playReminderPattern()`、`playFallbackReminderPattern()`。
- 导航/交互：`showScreen()`、`initSwipe()`、`toggleTheme()`、`applyTheme()`。
- PWA：`installApp()`、`beforeinstallprompt` 事件、`navigator.serviceWorker.register("./sw.js")`。

## 样式与界面约定

- 主色变量在 `styles.css` 的 `:root` 中定义，例如 `--blue`、`--purple`、`--orange`、`--green`。
- 浅色主题通过 `body.light` 覆盖 CSS 变量。
- 页面使用 `100dvh`、安全区变量 `--safe-top` / `--safe-bottom`，适配手机浏览器和 PWA 全屏环境。
- 主布局是移动端应用壳：`#app` 固定高度、最大宽度 480px、内部横向屏幕切换。
- 当前 HTML 中仍有较多内联样式和内联 `onclick`，脚本通过 `exposeActions()` 兼容这些事件。

## 运行与验证

多文件版可直接打开 `安卓版/index.html` 做基础查看。

如果需要验证 PWA、Service Worker、音频加载或 manifest，建议在 `安卓版/` 目录启动本地 HTTP 服务，例如：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

注意：Service Worker 只在 `http:` 或 `https:` 协议下注册，直接用 `file://` 打开不会注册。

## 修改注意事项

- 修改多文件版时，优先编辑 `index.html`、`styles.css`、`script.js`。
- 若改动需要分发单文件版，记得同步更新 `断食守护健康-v2.2.1.html`，否则多文件版和单文件版会不一致。
- 若变更缓存资源、JS/CSS 行为或版本号，建议同步更新 `sw.js` 的 `CACHE_NAME`，避免旧缓存影响验证。
- 若新增 PWA 资源，记得加入 `sw.js` 的 `APP_ASSETS`。
- 若修改应用名称、版本或图标，检查 `index.html`、`manifest.webmanifest`、`sw.js`、单文件版标题是否一致。
- 若改动稳糖提醒音频，确认 `reminder.mp3`、`sw.js` 缓存列表和单文件版内嵌音频都已同步。
- 用户数据都在浏览器本地，调试清数据前应提醒备份或使用应用内导出功能。
- 体重和断食日期逻辑使用北京时间相关转换，改日期函数时要特别小心。

## 当前文件规模

扫描时主要文件行数：

- `index.html`：544 行
- `styles.css`：1366 行
- `script.js`：1727 行
- `sw.js`：40 行
- `manifest.webmanifest`：17 行
- `断食守护健康-v2.2.1.html`：3642 行
- `README.md`：22 行
