// Immediate log to verify script loads
console.log('🔧 BACKGROUND SCRIPT LOADED');

const isArcBrowser = navigator.userAgent.includes('Arc/');

// Handle extension icon click - open resizable popup
chrome.action.onClicked.addListener(async (tab) => {
  console.log('🖱️ EXTENSION ICON CLICKED - opening resizable popup');
  
  try {
    await chrome.windows.create({
      url: chrome.runtime.getURL('index.html'),
      width: 450,
      height: 650,
      type: 'popup',
      focused: true
    });
    console.log('✅ Resizable popup opened successfully');
  } catch (error) {
    console.error('❌ Failed to open popup:', error);
  }
});

// Handle keyboard shortcut messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.action !== 'openTodo') {
    return undefined;
  }

  (async () => {
    console.log('Opening todo via message, Is Arc:', isArcBrowser);

    try {
      await chrome.windows.create({
        url: chrome.runtime.getURL('index.html'),
        width: 450,
        height: 650,
        type: 'popup',
        focused: true
      });
      sendResponse({ success: true, method: 'popup' });
    } catch (error) {
      console.error('Failed to open popup via message:', error);
      sendResponse({ success: false, error: error.message });
    }
  })();

  return true; // Keep the message channel open for async response
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isArcBrowser,
  };
}