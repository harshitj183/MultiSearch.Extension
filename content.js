const defaultEngines = [
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?q=%s',
    iconCode: '<img src="https://www.google.com/favicon.ico" width="16" height="16" alt="Google">'
  },
  {
    id: 'bing',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=%s',
    iconCode: '<img src="https://www.bing.com/favicon.ico" width="16" height="16" alt="Bing">'
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=%s',
    iconCode: '<img src="https://duckduckgo.com/favicon.ico" width="16" height="16" alt="DuckDuckGo">'
  },
  {
    id: 'yandex',
    name: 'Yandex',
    url: 'https://yandex.com/search/?text=%s',
    iconCode: '<img src="https://yandex.com/favicon.ico" width="16" height="16" alt="Yandex">'
  }
];

// Create the navbar container
const navbar = document.createElement('div');
navbar.id = 'searchSwitcherNavbar';
document.body.appendChild(navbar);

// Load saved position and minimized state
const savedPosition = JSON.parse(localStorage.getItem('navbarPosition') || '{}');
const isMinimized = localStorage.getItem('navbarMinimized') === 'true';

if (savedPosition.top && savedPosition.left) {
  navbar.style.top = savedPosition.top;
  navbar.style.left = savedPosition.left;
  navbar.style.right = 'auto';
}

if (isMinimized) {
  navbar.classList.add('minimized');
}

// Global state for engines
let activeEngines = [];
let widgetSettings = {};

function renderWidget() {
  const isMin = navbar.classList.contains('minimized');

  let buttonsHtml = '';
  activeEngines.forEach(engine => {
    // Get icon - use iconCode if available, otherwise create favicon img
    let iconHtml = '';
    if (engine.iconCode) {
      iconHtml = engine.iconCode;
    } else {
      // Fallback: try to get favicon from URL
      try {
        const engineUrl = new URL(engine.url.replace('%s', ''));
        iconHtml = `<img src="${engineUrl.origin}/favicon.ico" width="16" height="16" alt="${engine.name}">`;
      } catch (e) {
        iconHtml = engine.name[0]; // Fallback to first letter
      }
    }

    buttonsHtml += `<button class="engine-btn" data-id="${engine.id}" data-url="${engine.url}" data-tooltip="Search with ${engine.name}">
      <span class="btn-icon">${iconHtml}</span>
      <span class="btn-text">${engine.name}</span>
    </button>`;
  });

  navbar.innerHTML = `
    <div id="toggleMinimize" title="Minimize/Maximize">${isMin ? '+' : '−'}</div>
    <div id="navbarContainer">
      ${buttonsHtml}
    </div>
  `;

  // Re-attach event listeners since we wiped innerHTML
  attachEventListeners();
}

let wasDragging = false; // Flag to prevent click after drag

function attachEventListeners() {
  // Toggle minimize
  document.getElementById('toggleMinimize').addEventListener('click', function (e) {
    e.stopPropagation();
    navbar.classList.toggle('minimized');
    const isNowMinimized = navbar.classList.contains('minimized');
    this.textContent = isNowMinimized ? '+' : '−';
    localStorage.setItem('navbarMinimized', isNowMinimized);
  });

  // Make entire navbar draggable
  navbar.addEventListener('mousedown', dragStart);
  navbar.addEventListener('touchstart', dragStart);

  // Engine buttons
  document.querySelectorAll('.engine-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      if (wasDragging) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Add click animation
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);

      const url = this.getAttribute('data-url');
      const id = this.getAttribute('data-id');
      switchSearchEngine(url, id);
    });
  });
}

// Make navbar draggable
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let dragStartTime = 0;
let startX = 0;
let startY = 0;

document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);
document.addEventListener('touchmove', drag);
document.addEventListener('touchend', dragEnd);

function dragStart(e) {
  // Don't drag if clicking minimize button
  if (e.target.id === 'toggleMinimize') return;

  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

  initialX = clientX - xOffset;
  initialY = clientY - yOffset;

  startX = clientX;
  startY = clientY;
  dragStartTime = Date.now();
  wasDragging = false;

  if (navbar.contains(e.target)) {
    isDragging = true;
    navbar.style.transition = 'none';
  }
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    // Check if moved significantly to consider it a drag
    if (Math.abs(clientX - startX) > 3 || Math.abs(clientY - startY) > 3) {
      wasDragging = true;
      navbar.style.cursor = 'grabbing';
    }

    currentX = clientX - initialX;
    currentY = clientY - initialY;

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, navbar);
  }
}

function dragEnd(e) {
  if (isDragging) {
    initialX = currentX;
    initialY = currentY;

    isDragging = false;
    navbar.style.cursor = 'default'; // Reset cursor
    navbar.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    // Save position
    const rect = navbar.getBoundingClientRect();
    const position = {
      top: rect.top + 'px',
      left: rect.left + 'px'
    };
    localStorage.setItem('navbarPosition', JSON.stringify(position));

    // Update position to fixed values
    navbar.style.top = position.top;
    navbar.style.left = position.left;
    navbar.style.right = 'auto';
    navbar.style.transform = 'none';
    xOffset = 0;
    yOffset = 0;

    // Reset wasDragging after a short delay to allow click events to check it
    setTimeout(() => {
      wasDragging = false;
    }, 50);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = `translate(${xPos}px, ${yPos}px)`;
}

// Get the current query and switch search engine
function switchSearchEngine(urlTemplate, engineId) {
  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  // Try to find a query param. 
  // Common ones: q, text, query, search_query, p (yahoo)
  const query = queryParams.get('q') ||
    queryParams.get('text') ||
    queryParams.get('query') ||
    queryParams.get('search_query') ||
    queryParams.get('p') ||
    '';

  if (!urlTemplate.includes('%s')) {
    console.error("Invalid URL template");
    return;
  }

  const newUrl = urlTemplate.replace('%s', encodeURIComponent(query));

  // Update stats
  updateStats(engineId);

  // Add exit animation
  navbar.classList.add('exiting');

  setTimeout(() => {
    if (widgetSettings.openInNewTab) {
      window.open(newUrl, '_blank');
      navbar.classList.remove('exiting');
    } else {
      window.location.href = newUrl;
    }
  }, 200);
}

function updateStats(engineId) {
  try {
    // Get current URL query
    const currentUrl = new URL(window.location.href);
    const queryParams = currentUrl.searchParams;
    const query = queryParams.get('q') ||
      queryParams.get('text') ||
      queryParams.get('query') ||
      queryParams.get('search_query') ||
      queryParams.get('p') ||
      '';

    chrome.storage.local.get(['searchStats'], function (result) {
      const stats = result.searchStats || { total: 0, engines: {}, history: [] };

      // Increment totals
      stats.total = (stats.total || 0) + 1;
      if (!stats.engines) stats.engines = {};
      stats.engines[engineId] = (stats.engines[engineId] || 0) + 1;

      // Add to history with timestamp
      if (!stats.history) stats.history = [];
      stats.history.push({
        engine: engineId,
        query: query,
        timestamp: new Date().toISOString()
      });

      // Keep only last 1000 searches
      if (stats.history.length > 1000) {
        stats.history = stats.history.slice(-1000);
      }

      chrome.storage.local.set({ searchStats: stats }, function () {
        // Notify popup if open
        chrome.runtime.sendMessage({ action: 'updateStats' }).catch(() => { });
      });
    });
  } catch (e) {
    console.error("Error updating stats", e);
  }
}

// Check if dark mode is preferred by the user - PURELY SYSTEM BASED
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

const setTheme = (darkModeOn) => {
  if (darkModeOn) {
    navbar.classList.add("dark-mode");
    navbar.classList.remove("light-mode");
  } else {
    navbar.classList.add("light-mode");
    navbar.classList.remove("dark-mode");
  }
};

// Initial theme
setTheme(prefersDarkScheme.matches);

// Listen for changes
prefersDarkScheme.addEventListener("change", (e) => {
  setTheme(e.matches);
});

function renderWidgetIfSearchPage() {
  const currentUrl = window.location.href;
  const isMatch = activeEngines.some(engine => isSearchPage(currentUrl, engine));

  if (isMatch) {
    if (navbar.innerHTML === '') renderWidget(); // only render if needed
    navbar.style.display = 'flex';
  } else {
    navbar.style.display = 'none';
  }
}

function isSearchPage(currentUrlStr, engine) {
  try {
    const currentUrl = new URL(currentUrlStr);
    const engineUrl = new URL(engine.url.replace('%s', 'test'));

    // Check hostname match
    if (!currentUrl.hostname.includes(engineUrl.hostname.replace('www.', ''))) {
      return false;
    }

    // Check for query param if present in engine URL
    const engineParams = new URLSearchParams(engineUrl.search);
    let queryParamName = null;

    for (const [key, value] of engineParams.entries()) {
      if (value === 'test') {
        queryParamName = key;
        break;
      }
    }

    if (queryParamName) {
      return currentUrl.searchParams.has(queryParamName);
    }
    return true;
  } catch (e) {
    return false;
  }
}

// Load and apply settings from storage
function loadSettings() {
  chrome.storage.sync.get([
    'widgetPosition',
    'widgetSize',
    'animationSpeed',
    'showTooltips',
    'customEngines',
    'disabledEngines',
    'openInNewTab'
  ], function (result) {
    widgetSettings = result;
    applySettings(result);
  });
}

// Apply settings to widget
function applySettings(settings) {
  // 1. Build list of active engines
  const custom = settings.customEngines || [];
  const disabled = settings.disabledEngines || [];
  const allEngines = [...defaultEngines, ...custom];

  activeEngines = allEngines.filter(e => !disabled.includes(e.id));

  // Re-render the widget with new engines
  renderWidget();
  renderWidgetIfSearchPage();

  // 2. Apply Size
  if (settings.widgetSize) {
    navbar.classList.remove('size-small', 'size-medium', 'size-large');
    navbar.classList.add(`size-${settings.widgetSize}`);
  }

  // 3. Apply Animation Speed
  if (settings.animationSpeed) {
    const speeds = { fast: '0.15s', normal: '0.2s', slow: '0.3s' };
    navbar.style.transitionDuration = speeds[settings.animationSpeed] || '0.2s';
  }

  // 4. Apply Tooltips
  if (settings.showTooltips === false) {
    navbar.classList.add('no-tooltips');
  } else {
    navbar.classList.remove('no-tooltips');
  }

  // 5. Apply Position
  if (settings.widgetPosition) {
    const positions = {
      'top-right': { top: '20px', right: '20px', left: 'auto', bottom: 'auto' },
      'top-left': { top: '20px', left: '20px', right: 'auto', bottom: 'auto' },
      'bottom-right': { bottom: '20px', right: '20px', top: 'auto', left: 'auto' },
      'bottom-left': { bottom: '20px', left: '20px', right: 'auto', top: 'auto' }
    };
    const pos = positions[settings.widgetPosition];
    if (pos) {
      // Only apply if user hasn't manually dragged the widget
      const savedPosition = localStorage.getItem('navbarPosition');
      if (!savedPosition) {
        Object.assign(navbar.style, pos);
        navbar.style.transform = 'none';
      }
    }
  }
}

// Listen for settings updates from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'applySettings') {
    widgetSettings = request.settings;
    applySettings(request.settings);
    sendResponse({ success: true });
  }

  if (request.action === 'resetPosition') {
    // Clear saved position from localStorage
    localStorage.removeItem('navbarPosition');

    navbar.style.top = '20px';
    navbar.style.right = '20px';
    navbar.style.left = 'auto';
    navbar.style.bottom = 'auto';
    navbar.style.transform = 'none';
    xOffset = 0;
    yOffset = 0;
    sendResponse({ success: true });
  }

  return true;
});

// Keyboard shortcuts (Alt+1, Alt+2, etc.)
document.addEventListener('keydown', function (e) {
  if (e.altKey && !e.ctrlKey && !e.shiftKey) {
    const num = parseInt(e.key);
    if (!isNaN(num) && num > 0 && num <= activeEngines.length) {
      e.preventDefault();
      const engine = activeEngines[num - 1]; // 1-based index
      if (engine) {
        switchSearchEngine(engine.url, engine.id);
      }
    }
  }
});

// Add a subtle pulse animation on first load
setTimeout(() => {
  navbar.style.animation = 'none';
}, 1000);

// Initialize
loadSettings();

console.log('Multi Search Engine Widget loaded!');
