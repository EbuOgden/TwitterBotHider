chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if(tab.url && tab.url.includes("status/")) {
        const pathParameter = tab.url.split("status/")[1];

        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            tweetId: pathParameter
        });
    }
});
