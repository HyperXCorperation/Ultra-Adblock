// background.js

console.log("Ultra Adblock background service worker started.");

let isEnabled = true; // Initial blocking state
let blockedCount = 0;

// Function to update declarativeNetRequest rules
async function updateDynamicRules(rulesToAdd, ruleIdsToRemove = []) {
  try {
    await chrome.declarativeNetRequest.updateRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: rulesToAdd,
    });
    console.log("Dynamic rules updated successfully.");
  } catch (error) {
    console.error("Error updating dynamic rules:", error);
  }
}

// Load initial rules on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateRules({
    addRules: rulesJson, // Assuming rulesJson is imported or defined elsewhere
    removeRuleIds: []
  });
  console.log("Initial rules loaded.");
});

// Function to get the current blocking state
function getBlockingState() {
  return isEnabled;
}

// Function to get the current blocked count
function getBlockedCount() {
  return blockedCount;
}

// Listen for messages from the popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleBlocking") {
    isEnabled = request.enabled;
    console.log("Blocking toggled:", isEnabled);
    // In a more complex scenario, you might enable/disable specific rulesets here
  } else if (request.action === "getBlockingState") {
    sendResponse({ isEnabled: getBlockingState() });
  } else if (request.action === "getBlockedCount") {
    sendResponse({ count: getBlockedCount() });
  } else if (request.action === "incrementBlockedCount") {
    blockedCount++;
    // Optionally send an update to the popup
    chrome.runtime.sendMessage({ action: 'updateBlockedCount', count: blockedCount });
  }
});

// Listen for declarativeNetRequest events to count blocked requests (optional for UI feedback)
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  if (isEnabled) {
    blockedCount++;
    // Optionally send an update to the popup
    chrome.runtime.sendMessage({ action: 'updateBlockedCount', count: blockedCount });
  }
});

// Import the rules JSON (assuming it's in a separate file or defined here)
import rulesJson from './rules.json' assert { type: 'json' };