const defaultEngines = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=%s' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=%s' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%s' },
  { id: 'yandex', name: 'Yandex', url: 'https://yandex.com/search/?text=%s' }
];

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Multi Search Extension installed!');
  updateContextMenus();
});

// Update context menus on startup
chrome.runtime.onStartup.addListener(() => {
  updateContextMenus();
});

// Listen for storage changes to update context menus
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && (changes.customEngines || changes.disabledEngines)) {
    updateContextMenus();
  }
});

function updateContextMenus() {
  chrome.storage.sync.get(['customEngines', 'disabledEngines'], (result) => {
    chrome.contextMenus.removeAll(() => {
      const custom = result.customEngines || [];
      const disabled = result.disabledEngines || [];
      const allEngines = [...defaultEngines, ...custom];

      const activeEngines = allEngines.filter(e => !disabled.includes(e.id));

      if (activeEngines.length > 0) {
        chrome.contextMenus.create({
          id: 'search-root',
          title: 'Search "%s" with...',
          contexts: ['selection']
        });

        activeEngines.forEach(engine => {
          chrome.contextMenus.create({
            parentId: 'search-root',
            id: `search-${engine.id}`,
            title: engine.name,
            contexts: ['selection']
          });
        });
      }
    });
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith('search-root')) return;

  if (info.menuItemId.startsWith('search-')) {
    const engineId = info.menuItemId.replace('search-', '');
    const query = info.selectionText;

    chrome.storage.sync.get(['customEngines'], (result) => {
      const custom = result.customEngines || [];
      const allEngines = [...defaultEngines, ...custom];
      const engine = allEngines.find(e => e.id === engineId);

      if (engine && engine.url) {
        const url = engine.url.replace('%s', encodeURIComponent(query));
        chrome.tabs.create({ url: url });

        // Track stats
        updateStats(engineId);
      }
    });
  }
});

function updateStats(engineId) {
  // Notify to update stats if possible, or just let content script handle it mostly.
  // Since background doesn't have local storage access reliably for this "stats" pattern which seems to be localStorage based in content script/popup, 
  // we might need to migrate stats to sync storage or just accept context menu stats might be separate or need a different tracking mechanism.
  // For now, let's skip complex stats logic in background to avoid breaking changes, as user didn't ask for deep stats rework.
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'resetPosition') {
    chrome.storage.local.remove(['navbarPosition', 'navbarMinimized']);
  }
  return true;
});

console.log('Multi Search Extension background script loaded!');
