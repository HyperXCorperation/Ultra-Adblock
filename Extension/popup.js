// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const toggleAdblock = document.getElementById('toggleAdblock');
    const adsBlockedCount = document.getElementById('adsBlockedCount');
  
    // Function to update the toggle state based on background script
    function updateToggleState(isEnabled) {
      toggleAdblock.checked = isEnabled;
    }
  
    // Function to update the blocked ads count
    function updateBlockedCount(count) {
      adsBlockedCount.textContent = count;
    }
  
    // Get the initial blocking state and blocked count from the background script
    chrome.runtime.sendMessage({ action: 'getBlockingState' }, (response) => {
      if (response && response.isEnabled !== undefined) {
        updateToggleState(response.isEnabled);
      }
    });
  
    chrome.runtime.sendMessage({ action: 'getBlockedCount' }, (response) => {
      if (response && response.count !== undefined) {
        updateBlockedCount(response.count);
      }
    });
  
    // Listen for changes to the toggle
    toggleAdblock.addEventListener('change', () => {
      const isEnabled = toggleAdblock.checked;
      chrome.runtime.sendMessage({ action: 'toggleBlocking', enabled: isEnabled });
    });
  
    // Listen for updates to the blocked count from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'updateBlockedCount') {
        updateBlockedCount(request.count);
      }
    });
  });