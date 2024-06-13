// Example background script to manage search engine preferences
chrome.runtime.onInstalled.addListener(() => {
  // Set a default search engine preference if not set
  chrome.storage.sync.get(['defaultSearchEngine'], function(result) {
    if (!result.defaultSearchEngine) {
      chrome.storage.sync.set({defaultSearchEngine: 'google'});
    }
  });
});
