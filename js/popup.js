let currTabId

chrome.tabs.onActivated.addListener((tabId, changeInfo, tab) => {
    console.log('new window opened')
    chrome.tabs.get(tabId.tabId, function (tab) {
        currTabId = tab.id
    })
});

document.addEventListener('DOMContentLoaded', function load(event) {
    const createButton = document.querySelector('#genColor');

    createButton.addEventListener('change', () => buttonClicked());
});

async function buttonClicked() {
    const widthValue = document.querySelector('#genColor').value;
    await chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        currTabId = tabs[0].id
        console.log(currTabId)
        chrome.tabs.sendMessage(currTabId, widthValue, function (response) {
            console.log(response)
        });
    });
}