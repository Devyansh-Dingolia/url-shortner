// ---------- Helpers ----------

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

function hideError(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  el.hidden = true;
}

// ---------- Shorten page ----------

async function handleShorten(event) {
  event.preventDefault();
  hideError('shorten-error');

  // 1. Get value from #original-url input
  const originalUrl = document.getElementById('original-url').value.trim();
  if (!originalUrl) {
    showError('shorten-error', 'Please enter a URL.');
    return;
  }

  // 2. Call api.client method
  const shortenBtn = document.getElementById('shorten-btn');
  shortenBtn.disabled = true;
  shortenBtn.textContent = 'Shortening...';

  const expiresInput = document.getElementById('expires-at');
  const expiresAt = expiresInput && expiresInput.value
    ? new Date(expiresInput.value + 'T23:59:59').toISOString()
    : undefined;

  let response;
  try {
    response = await window.api.shortenUrl(originalUrl, expiresAt);
  } finally {
    shortenBtn.disabled = false;
    shortenBtn.textContent = 'Shorten';
  }

  // 3. Show errors in #shorten-error
  if (!response.success) {
    showError('shorten-error', response.message || 'Failed to shorten URL.');
    return;
  }

  const shortCode = response.data && response.data.shortCode;
  const shortUrl = `${window.api.API_BASE_URL}/${shortCode}`;

  // 4. Show result in #shortened-result / #shortened-url (it's an <a> tag)
  const link = document.getElementById('shortened-url');
  link.textContent = shortUrl;
  link.href = shortUrl;
  document.getElementById('shortened-result').hidden = false;
}

async function handleCopy() {
  // Copy text from #shortened-url to clipboard
  const url = document.getElementById('shortened-url').textContent;
  const copyBtn = document.getElementById('copy-btn');
  if (!url) return;

  copyBtn.disabled = true;
  copyBtn.textContent = 'Copied!';

  setTimeout(() => {
    copyBtn.disabled = false;
    copyBtn.textContent = 'Copy';
  }, 2000);

  try {
    await navigator.clipboard.writeText(url);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

// ---------- Stats page ----------

async function handleGetStats(event) {
  event.preventDefault();
  // 1. Get value from #short-url input, extract shortCode (last path segment).
  const shortUrl = document.getElementById('short-url').value.trim().split('/').pop();

  // 2. Call: const response = await window.api.getUrlStats(shortCode);
  const statsBtn = document.getElementById('stats-btn');
  statsBtn.disabled = true;
  statsBtn.textContent = 'Fetching...';

  const response = await window.api.getUrlStats(shortUrl);

  statsBtn.disabled = false;
  statsBtn.textContent = 'Get Stats';

  if (!response.success) {
    showError('stats-error', response.message || 'Failed to fetch stats.');
    return;
  }

  const data = response.data;

  // 3. Fill table cells with the data
  document.getElementById('stat-original-url').textContent = data.originalUrl || '';
  document.getElementById('stat-short-url').textContent = `${window.api.API_BASE_URL}/${data.shortCode}` || '';
  document.getElementById('stat-short-code').textContent = data.shortCode || '';
  document.getElementById('stat-clicks').textContent = data.clicks || '0';
  document.getElementById('stat-created-at').textContent = new Date(data.createdAt).toLocaleString() || '';

  document.getElementById('stats-result').hidden = false;
  hideError('stats-error');
}

// ---------- Init ----------

document.addEventListener('DOMContentLoaded', () => {
  const expiresInput = document.getElementById('expires-at');
  if (expiresInput) {
    // Block past dates in the calendar picker.
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    expiresInput.min = `${yyyy}-${mm}-${dd}`;
  }

  const shortenForm = document.getElementById('shorten-form');
  if (shortenForm) {
    shortenForm.addEventListener('submit', handleShorten);
  }

  const copyBtn = document.getElementById('copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', handleCopy);
  }

  const statsForm = document.getElementById('stats-form');
  if (statsForm) {
    statsForm.addEventListener('submit', handleGetStats);
  }
});
