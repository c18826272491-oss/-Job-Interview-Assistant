const $ = (id) => document.getElementById(id);

// ── 加载已保存的设置 ──────────────────────────

chrome.storage.local.get(['apiUrl', 'apiKey', 'model'], (data) => {
  $('api-url').value = data.apiUrl || '';
  $('api-key').value = data.apiKey || '';
  $('model').value = data.model || '';
});

// ── 预设地址切换 ──────────────────────────────

$('api-preset').addEventListener('change', () => {
  const v = $('api-preset').value;
  if (v) $('api-url').value = v;
});

// ── 保存设置 ──────────────────────────────────

$('save-settings').addEventListener('click', () => {
  const apiUrl = $('api-url').value.trim();
  if (!apiUrl) {
    $('settings-status').textContent = '请填写接口地址。';
    return;
  }
  try {
    new URL(apiUrl);
  } catch {
    $('settings-status').textContent = '接口地址格式不正确。';
    return;
  }
  chrome.storage.local.set({
    apiUrl,
    apiKey: $('api-key').value.trim(),
    model: $('model').value.trim()
  }, () => {
    $('settings-status').textContent = '已保存。关闭这个页面后即可在扩展中使用。';
  });
});

// ── 测试连接 ──────────────────────────────────

$('test-connection').addEventListener('click', async () => {
  const apiUrl = $('api-url').value.trim();
  const apiKey = $('api-key').value.trim();
  const model = $('model').value.trim() || 'gpt-4.1-mini';

  if (!apiUrl || !apiKey) {
    $('settings-status').textContent = '请先填写接口地址和 API Key。';
    return;
  }

  $('test-connection').textContent = '测试中…';
  $('test-connection').disabled = true;
  $('settings-status').textContent = '正在测试连接…';

  const base = apiUrl.replace(/\/+$/, '');
  let url = base;
  if (/\/chat\/completions$/i.test(url)) { /* already full */ }
  else if (/\/v1$/i.test(url)) url = `${url}/chat/completions`;
  else if (/api\.openai\.com$/i.test(url)) url = `${url}/v1/chat/completions`;
  else url = `${url}/chat/completions`;

  const testBody = { model: model, messages: [{ role: 'user', content: 'Hi' }], max_tokens: 5 };
  if (/deepseek/i.test(model)) testBody.thinking = { type: 'disabled' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(testBody)
    });

    if (res.ok) {
      $('settings-status').textContent = `连接成功！接口和模型 "${model}" 均可用。`;
    } else {
      const detail = await res.text();
      $('settings-status').textContent = `连接失败（${res.status}）：${detail.slice(0, 150)}`;
    }
  } catch (e) {
    $('settings-status').textContent = `连接失败：${e.message}`;
  }

  $('test-connection').textContent = '测试连接';
  $('test-connection').disabled = false;
});

// ── 关闭页面 ──────────────────────────────────

$('close-options').addEventListener('click', () => {
  window.close();
});
