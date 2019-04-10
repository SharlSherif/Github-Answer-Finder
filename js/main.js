chrome.runtime.onMessage.addListener(function(width, sender, sendResponse) {
    GenerateBorders(width)
    sendResponse('thanks!')
});

function GenerateBorders(width) {
    const PageElements = document.querySelectorAll("*");
    for (let element of PageElements) {
        const generateColor = randomColor({count: 1});

        element.style['border'] = `${width}px solid ${generateColor}`;
    }
}
