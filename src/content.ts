chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_PAGE_CONTENT") {
    sendResponse({ data: document.body.innerText });
  }
});
