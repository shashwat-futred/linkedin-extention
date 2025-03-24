// Debug logging function
function log(message) {
  console.log(`[Content] ${message}`);
}

// Initialize content script
log('Content script initialized');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log(`Received message: ${request.action}`);
  // Add any LinkedIn page interaction logic here if needed
}); 