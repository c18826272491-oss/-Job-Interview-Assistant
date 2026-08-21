// ── Prompt 加载器 ──────────────────────────────
// 所有 Prompt 内容存放在 prompts/*.md 中，方便跨设备维护
// 使用同步 XHR 确保扩展文件 100% 加载，避免 Chrome fetch 缓存问题

function loadPrompt(path) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', chrome.runtime.getURL(path), false);
  try { xhr.send(); return xhr.responseText || ''; }
  catch (e) { console.error('Prompt加载失败：' + path, e); return ''; }
}

const _v = Date.now();
let JD_ANALYSIS_PROMPT = loadPrompt('prompts/jd-analysis.md?_=' + _v);
let INTERVIEW_PREP_PROMPT = loadPrompt('prompts/interview-prep.md?_=' + _v);
let RESUME_OPTIMIZE_PROMPT = loadPrompt('prompts/resume-optimize.md?_=' + _v);
let GREETING_PROMPT = loadPrompt('prompts/greeting.md?_=' + _v);
let promptsReady = true;
const promptsLoaded = Promise.resolve();
