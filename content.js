// Create and style the navbar
const navbar = document.createElement('div');
navbar.id = 'searchSwitcherNavbar';
navbar.innerHTML = `
  <div id="navbarContainer">
    <button id="switchToGoogle" data-tooltip="Search with Google">Google</button>
    <button id="switchToBing" data-tooltip="Search with Bing">Bing</button>
    <button id="switchToDuckDuckGo" data-tooltip="Search with DuckDuckGo">DuckDuckGo</button>
  </div>
`;
document.body.appendChild(navbar);

// Add event listeners to the buttons
document.getElementById('switchToGoogle').addEventListener('click', function() {
  switchSearchEngine('google');
});
document.getElementById('switchToBing').addEventListener('click', function() {
  switchSearchEngine('bing');
});
document.getElementById('switchToDuckDuckGo').addEventListener('click', function() {
  switchSearchEngine('duckduckgo');
});

// Get the current query and switch search engine
function switchSearchEngine(engine) {
  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const query = queryParams.get('q');

  let newUrl;
  switch (engine) {
    case 'google':
      newUrl = new URL('https://www.google.com/search');
      break;
    case 'bing':
      newUrl = new URL('https://www.bing.com/search');
      break;
    case 'duckduckgo':
      newUrl = new URL('https://duckduckgo.com/');
      break;
  }

  // Preserve query parameters
  queryParams.forEach((value, key) => {
    if (key !== 'q') {
      newUrl.searchParams.set(key, value);
    }
  });

  // Set the new query parameter
  newUrl.searchParams.set('q', query);

  // Remove navbar before navigating
  navbar.classList.add('exiting');
  setTimeout(() => {
    window.location.href = newUrl.href;
  }, 300); // Match the transition duration
}














// Check if dark mode is preferred by the user
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Function to set the theme based on preference
const setTheme = (darkModeOn) => {
  const body = document.body;
  if (darkModeOn) {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
  } else {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
  }
};

// Initial theme based on user preference
setTheme(prefersDarkScheme.matches);

// Listen for changes in user preference
prefersDarkScheme.addEventListener("change", (e) => {
  setTheme(e.matches);
});
