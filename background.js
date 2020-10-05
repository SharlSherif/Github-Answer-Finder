count = 0;
chrome.webNavigation.onCompleted.addListener(function (details) {
    count++
    console.log(chrome.webNavigation)
    const tabId = details.tabId
    const isIssue = /issues\//g.test(details.url)
    if (count < 2) return;
    else {
    chrome.tabs.executeScript(tabId, {
        file: "main.js"
    }, function () {
        chrome.tabs.sendMessage(tabId, isIssue);
    });
        count = 0;
    }
});