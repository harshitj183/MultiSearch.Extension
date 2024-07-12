document.getElementById('searchButton').addEventListener('click', function() {
  const query = document.getElementById('searchInput').value;
  const selectedEngine = document.querySelector('input[name="engine"]:checked').value;
  if (query) {
    searchQuery(query, selectedEngine);
  }
});

function searchQuery(query, engine) {
  let url;
  switch (engine) {
    case 'google':
      url = `https://www.google.com/search?q=${query}`;
      break;
    case 'bing':
      url = `https://www.bing.com/search?q=${query}`;
      break;
    case 'duckduckgo':
      url = `https://duckduckgo.com/?q=${query}`;
      break;
      case 'yandex':
        url = `https://yandex.com/search/?text=${query}`;
        break;
    default:
      url = `https://www.google.com/search?q=${query}`;
  }

  // Open search result in a new tab
  chrome.tabs.create({ url });
}

// Event listeners for navbar buttons
document.getElementById('homeButton').addEventListener('click', function() {
  resetPopup();
});

document.getElementById('googleButton').addEventListener('click', function() {
  navigateTo('google');
});

document.getElementById('bingButton').addEventListener('click', function() {
  navigateTo('bing');
});

document.getElementById('duckduckgoButton').addEventListener('click', function() {
  navigateTo('duckduckgo');
});

document.getElementById('yandexButton').addEventListener('click', function() {
  navigateTo('yandex');
});

function navigateTo(engine) {
  let url;
  switch (engine) {
    case 'google':
      url = `https://www.google.com/`;
      break;
    case 'bing':
      url = `https://www.bing.com/`;
      break;
    case 'duckduckgo':
      url = `https://duckduckgo.com/`;
      break;
      case 'yandex':
      url = `https://yandex.com/`;
      break;
    default:
      url = `https://www.google.com/`;
  }

  // Open search engine home page in a new tab
  chrome.tabs.create({ url });
}

function resetPopup() {
  document.getElementById('searchInput').value = '';
  document.querySelector('input[name="engine"][value="google"]').checked = true;
  document.getElementById('results').innerHTML = '';
}
