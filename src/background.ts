// background.ts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "getCurrentTabUrl") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      sendResponse({ url: tabs[0].url }); // Send the current tab's URL to the sender
    });
    return true; // Keeps the response channel open
  }
});
