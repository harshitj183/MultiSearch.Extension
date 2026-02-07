// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    // Add active class to clicked tab
    this.classList.add('active');

    // Show corresponding content
    const tabName = this.getAttribute('data-tab');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// Default engines configuration
// Default engines configuration
const defaultEngines = [
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?q=%s',
    iconCode: '<img src="https://www.google.com/favicon.ico" width="20" height="20" alt="Google">'
  },
  {
    id: 'bing',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=%s',
    iconCode: '<img src="https://www.bing.com/favicon.ico" width="20" height="20" alt="Bing">'
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=%s',
    iconCode: '<img src="https://duckduckgo.com/favicon.ico" width="20" height="20" alt="DuckDuckGo">'
  },
  {
    id: 'yandex',
    name: 'Yandex',
    url: 'https://yandex.com/search/?text=%s',
    iconCode: '<img src="https://yandex.com/favicon.ico" width="20" height="20" alt="Yandex">'
  }
];

// Popular engines for quick add
const popularEngines = [
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/results?search_query=%s',
    iconCode: '<img src="https://www.youtube.com/favicon.ico" width="20" height="20" alt="YouTube">'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com/?q=%s',
    iconCode: '<img src="https://chatgpt.com/favicon.ico" width="20" height="20" alt="ChatGPT">'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com/?q=%s',
    iconCode: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACbElEQVR4AWJwL/ChKyZL0y9XpzJAr/UAG0sYhWE4xrVt27Zt27Zt1ba7Rm27vbZt226/9sxmNtN1MZvkTSZ8cs7op8wG/ho58iVlFvDzuKn1f44ciQ8TZoCu+QZpOsGXsRPxasYCXFu4R8gr+MG+WyUWu71wKzLXOGCFxKMSb+DXCRNPcjHldgWc9p88yQv4efnw1ZqY495M7Dp2G5Mtvq8uVfDLnPG99GFLLF9hivUXDLL536tUwM8rR/Z6vWYGbu1cg8x9FirsUEYhbLjVH8ok1OgaXx4epsbkx4RwsEjTwvpZ5LIZXa/ep/GzdYdThF23n4YUp20QeVnDxikW2x2u6MS6W6rqcgLoegInO1ugklHwW0KD+r/E9YTvA1uCui4YiDTlBAaz8BdihV8WFrjdU2OakGadT0BQUH0t8G9SlR1/46u9/BpTH2wPktsymF/MAlgEH8JyhQqc6HUf/Zw+oZftT4OYBvyyoC1q8Hd6tR0/s2q//JTTEBRhF892R9jpUQy4Lnk3A44U5KCf7w30c3lDoHFMJ6ix0ucX2wgIY0GHs/MYcGq0E4ZJoxi0j/tT7pSGICG7UqMPTcb1wSdZcFPOBsxKPIYxoQL0FWQanbKz8YdGd15XZ672uzoDh88t505JqOaULFy814JbwM2ZvTSnJJSm1ERL/OJzUe6UA5UympKLlt6njbtedsr+YR7oLA1XowN9nq3m5fe05OSqkyNTN6Nd9FG0DfZj0O6irJO8/Q/pZ8uCLMrrD5hqHb9b2CBhIwPSNe9nmqapS+oTSNWI2Vufd5CqnLDiJWW2c2nZxCU7KP7BUigf+OW0iDHe5JwAAAAASUVORK5CYII=" width="20" height="20" alt="Gemini">'
  },
  {
    id: 'startpage',
    name: 'Startpage',
    url: 'https://www.startpage.com/do/search?q=%s',
    iconCode: '<img src="https://www.startpage.com/favicon.ico" width="20" height="20" alt="Startpage">'
  },
  {
    id: 'wolframalpha',
    name: 'Wolfram Alpha',
    url: 'https://www.wolframalpha.com/input/?i=%s',
    iconCode: '<img src="https://www.wolframalpha.com/_next/static/images/favicon_b48d893b991ff67016124a4d51822e63.ico" width="20" height="20" alt="Wolfram Alpha">'
  }
];

let customEngines = [];
let disabledEngines = [];


// Load settings from storage
function loadSettings() {
  chrome.storage.sync.get([
    'widgetPosition',
    'widgetSize',
    'animationSpeed',
    'autoMinimize',
    'showTooltips',
    'enableSounds',
    'enableNotifications',
    'customEngines',
    'disabledEngines',
    'defaultEngine',
    'openInNewTab',
    'preserveHistory'
  ], function (result) {
    // Apply loaded settings
    if (result.widgetPosition) document.getElementById('widgetPosition').value = result.widgetPosition;
    if (result.widgetSize) document.getElementById('widgetSize').value = result.widgetSize;
    if (result.animationSpeed) document.getElementById('animationSpeed').value = result.animationSpeed;

    document.getElementById('autoMinimize').checked = result.autoMinimize || false;
    document.getElementById('showTooltips').checked = result.showTooltips !== false;
    document.getElementById('enableSounds').checked = result.enableSounds || false;
    document.getElementById('enableNotifications').checked = result.enableNotifications !== false;

    if (result.defaultEngine) {
      // Populate default engine dropdown dynamically later
    }
    document.getElementById('openInNewTab').checked = result.openInNewTab || false;
    document.getElementById('preserveHistory').checked = result.preserveHistory !== false;

    // Load Engines
    customEngines = result.customEngines || [];
    disabledEngines = result.disabledEngines || [];
    renderEnginesList();
    renderPopularEngines();
    updateDefaultEngineDropdown();
  });
}

function renderEnginesList() {
  const container = document.getElementById('enginesList');
  container.innerHTML = '';

  // Combine defaults and custom
  const allEngines = [...defaultEngines, ...customEngines];

  allEngines.forEach(engine => {
    const isEnabled = !disabledEngines.includes(engine.id);
    const isCustom = !defaultEngines.find(e => e.id === engine.id);

    // Use iconCode if available, otherwise use first letter
    let iconHtml = engine.name[0].toUpperCase();
    if (engine.iconCode) {
      iconHtml = engine.iconCode;
    }

    const div = document.createElement('div');
    div.className = 'engine-item';
    div.innerHTML = `
      <div class="engine-info">
        <span class="engine-icon">${iconHtml}</span>
        <div class="engine-details">
          <span class="engine-name">${engine.name}</span>
          <span class="engine-url">${new URL(engine.url.replace('%s', 'test')).hostname}</span>
        </div>
      </div>
      <div class="engine-actions">
        ${isCustom ? `<button class="delete-btn" data-id="${engine.id}" title="Delete">×</button>` : ''}
        <label class="switch">
          <input type="checkbox" class="engine-toggle" data-id="${engine.id}" ${isEnabled ? 'checked' : ''}>
          <span class="slider round"></span>
        </label>
      </div>
    `;
    container.appendChild(div);
  });

  // Attach event listeners
  document.querySelectorAll('.engine-toggle').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      toggleEngine(e.target.dataset.id, e.target.checked);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      deleteEngine(e.target.dataset.id);
    });
  });
}

function toggleEngine(id, isEnabled) {
  if (isEnabled) {
    disabledEngines = disabledEngines.filter(e => e !== id);
  } else {
    if (!disabledEngines.includes(id)) disabledEngines.push(id);
  }
  chrome.storage.sync.set({ disabledEngines }, () => {
    updateDefaultEngineDropdown();
    notifySettingsChanged();
  });
}

function deleteEngine(id) {
  if (confirm('Delete this search engine?')) {
    customEngines = customEngines.filter(e => e.id !== id);
    // Also remove from disabled list if present to keep it clean
    disabledEngines = disabledEngines.filter(e => e !== id);

    chrome.storage.sync.set({ customEngines, disabledEngines }, () => {
      renderEnginesList();
      updateDefaultEngineDropdown();
      notifySettingsChanged();
    });
  }
}

// Add Custom Engine
document.getElementById('addEngineBtn').addEventListener('click', () => {
  const nameInput = document.getElementById('customEngineName');
  const urlInput = document.getElementById('customEngineUrl');

  const name = nameInput.value.trim();
  const url = urlInput.value.trim();

  if (!name || !url) {
    alert('Please enter both a name and a URL.');
    return;
  }

  if (!url.includes('%s')) {
    alert('The URL must contain "%s" as a placeholder for the search query.');
    return;
  }

  const id = 'custom_' + Date.now();
  customEngines.push({
    id,
    name,
    url,
    icon: name[0].toUpperCase()
  });

  chrome.storage.sync.set({ customEngines }, () => {
    nameInput.value = '';
    urlInput.value = '';
    renderEnginesList();
    updateDefaultEngineDropdown();
    notifySettingsChanged();
  });
});

function updateDefaultEngineDropdown() {
  const dropdown = document.getElementById('defaultEngine');
  const currentValue = dropdown.value;
  dropdown.innerHTML = '';

  const allEngines = [...defaultEngines, ...customEngines];
  allEngines.forEach(engine => {
    if (!disabledEngines.includes(engine.id)) {
      const option = document.createElement('option');
      option.value = engine.id;
      option.textContent = engine.name;
      dropdown.appendChild(option);
    }
  });

  if (currentValue && !disabledEngines.includes(currentValue)) {
    dropdown.value = currentValue;
  }
}

function notifySettingsChanged() {
  // combine all settings to send
  const settings = {
    customEngines,
    disabledEngines,
    widgetPosition: document.getElementById('widgetPosition').value,
    widgetSize: document.getElementById('widgetSize').value,
    animationSpeed: document.getElementById('animationSpeed').value,
    autoMinimize: document.getElementById('autoMinimize').checked,
    showTooltips: document.getElementById('showTooltips').checked,
    enableSounds: document.getElementById('enableSounds').checked,
    enableNotifications: document.getElementById('enableNotifications').checked,
    defaultEngine: document.getElementById('defaultEngine').value,
    openInNewTab: document.getElementById('openInNewTab').checked,
    preserveHistory: document.getElementById('preserveHistory').checked
  };

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'applySettings', settings: settings }).catch(() => { });
    }
  });
}

// Save settings (Global settings)
document.getElementById('saveSettings').addEventListener('click', function () {
  const settings = {
    widgetPosition: document.getElementById('widgetPosition').value,
    widgetSize: document.getElementById('widgetSize').value,
    animationSpeed: document.getElementById('animationSpeed').value,
    autoMinimize: document.getElementById('autoMinimize').checked,
    showTooltips: document.getElementById('showTooltips').checked,
    enableSounds: document.getElementById('enableSounds').checked,
    enableNotifications: document.getElementById('enableNotifications').checked,
    // customEngines & disabledEngines are saved immediately on change
    defaultEngine: document.getElementById('defaultEngine').value,
    openInNewTab: document.getElementById('openInNewTab').checked,
    preserveHistory: document.getElementById('preserveHistory').checked
  };

  chrome.storage.sync.set(settings, function () {
    const btn = document.getElementById('saveSettings');
    const originalText = btn.textContent;
    btn.textContent = 'Settings Saved!';
    btn.style.background = '#34a853';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2000);

    notifySettingsChanged();
  });
});

// Reset settings
document.getElementById('resetSettings').addEventListener('click', function () {
  if (confirm('Reset all settings and delete custom engines?')) {
    chrome.storage.sync.clear(function () {
      loadSettings();
      const btn = document.getElementById('resetSettings');
      const originalText = btn.textContent;
      btn.textContent = 'Reset Complete!';

      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    });
  }
});

// Initialize stats system
function getStats(callback) {
  chrome.storage.local.get(['searchStats'], function (result) {
    const stats = result.searchStats || { total: 0, engines: {}, history: [] };
    callback(stats);
  });
}

function saveStats(stats, callback) {
  chrome.storage.local.set({ searchStats: stats }, function () {
    if (callback) callback();
  });
}

function updateStats() {
  getStats(function (stats) {

    // Update total searches
    const totalElement = document.getElementById('totalSearches');
    if (totalElement) totalElement.textContent = stats.total || 0;

    // Calculate favorite engine
    const favoriteElement = document.getElementById('favoriteEngine');
    if (favoriteElement) {
      let maxCount = 0;
      let favorite = 'None';
      for (const [engine, count] of Object.entries(stats.engines || {})) {
        if (count > maxCount) {
          maxCount = count;
          favorite = engine.charAt(0).toUpperCase() + engine.slice(1);
        }
      }
      favoriteElement.textContent = favorite;
    }

    // Calculate today's searches
    const todayElement = document.getElementById('todaySearches');
    if (todayElement) {
      const today = new Date().toDateString();
      const todayCount = (stats.history || []).filter(entry => {
        return new Date(entry.timestamp).toDateString() === today;
      }).length;
      todayElement.textContent = todayCount;
    }

    // Calculate this week's searches
    const weekElement = document.getElementById('weekSearches');
    if (weekElement) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekCount = (stats.history || []).filter(entry => {
        return new Date(entry.timestamp) >= oneWeekAgo;
      }).length;
      weekElement.textContent = weekCount;
    }

    // Update engine breakdown
    updateEngineBreakdown(stats);
  });
}

function updateEngineBreakdown(stats) {
  const engines = stats.engines || {};
  const total = stats.total || 1; // Avoid division by zero

  // Update each default engine
  ['google', 'bing', 'duckduckgo', 'yandex'].forEach(engineId => {
    const count = engines[engineId] || 0;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    const countElement = document.getElementById(`${engineId}Count`);
    const progressElement = document.getElementById(`${engineId}Progress`);

    if (countElement) countElement.textContent = count;
    if (progressElement) progressElement.style.width = `${percentage}%`;
  });
}

// Track search event
function trackSearch(engineId, query) {
  getStats(function (stats) {

    // Increment total
    stats.total = (stats.total || 0) + 1;

    // Increment engine count
    if (!stats.engines) stats.engines = {};
    stats.engines[engineId] = (stats.engines[engineId] || 0) + 1;

    // Add to history
    if (!stats.history) stats.history = [];
    stats.history.push({
      engine: engineId,
      query: query,
      timestamp: new Date().toISOString()
    });

    // Keep only last 1000 searches in history
    if (stats.history.length > 1000) {
      stats.history = stats.history.slice(-1000);
    }

    saveStats(stats, function () {
      updateStats();
    });
  });
}

// Stats action buttons
document.getElementById('resetPosition')?.addEventListener('click', function () {
  chrome.storage.sync.set({ widgetPosition: 'top-right' }, function () {
    // Send message to all tabs to reset position
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'resetPosition'
        }).catch(() => { });
      });
    });
    alert('Widget position reset to top-right!');
  });
});

document.getElementById('clearData')?.addEventListener('click', function () {
  if (confirm('Are you sure you want to clear all statistics? This cannot be undone.')) {
    const emptyStats = { total: 0, engines: {}, history: [] };
    saveStats(emptyStats, function () {
      updateStats();
      alert('All statistics have been cleared!');
    });
  }
});

document.getElementById('exportData')?.addEventListener('click', function () {
  getStats(function (stats) {
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `multisearch-stats-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});

// Load settings and update stats on load
loadSettings();
updateStats();

// Listen for messages to update stats
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updateStats') {
    updateStats();
  }
  if (request.action === 'trackSearch') {
    trackSearch(request.engineId, request.query);
  }
});

// Keyboard navigation
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    window.close();
  }
});

// Render popular engines
function renderPopularEngines() {
  const container = document.getElementById('popularEnginesGrid');
  if (!container) return;
  container.innerHTML = '';

  popularEngines.forEach(engine => {
    // Check if already added (fuzzy match)
    const isAdded = customEngines.some(e => e.name === engine.name) ||
      defaultEngines.some(e => e.name === engine.name);

    if (isAdded) return; // Don't show if already added

    const div = document.createElement('div');
    div.className = 'popular-engine-card';
    div.title = `Add ${engine.name}`;

    // Use iconCode if available, otherwise use first letter
    let iconHtml = engine.name[0].toUpperCase();
    if (engine.iconCode) {
      iconHtml = engine.iconCode;
    }

    div.innerHTML = `
      <span class="popular-engine-icon">${iconHtml}</span>
      <span class="popular-engine-name">${engine.name}</span>
    `;

    div.addEventListener('click', () => {
      addPopularEngine(engine);
    });

    container.appendChild(div);
  });
}

function addPopularEngine(template) {
  const id = 'custom_' + Date.now();
  customEngines.push({
    id,
    name: template.name,
    url: template.url,
    iconCode: template.iconCode, // Use SVG if available
    icon: template.icon // fallback
  });

  chrome.storage.sync.set({ customEngines }, () => {
    renderEnginesList();
    renderPopularEngines(); // Update list to remove added one
    updateDefaultEngineDropdown();
    notifySettingsChanged();
  });
}

console.log('Multi Search Extension Popup loaded!');
