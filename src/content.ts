chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "GET_PAGE_CONTENT") {
    const bodyHTML = document.body.innerHTML;
    const headers = Array.from(document.querySelectorAll("h1, h2, h3")).map(
      (h) => h.innerHTML
    );
    console.log("html", bodyHTML);
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, () => {
      sendResponse({ bodyHTML, headers }); // Send the current tab's URL to the sender
    });
    return true; // Keeps the response channel open
  }
});
