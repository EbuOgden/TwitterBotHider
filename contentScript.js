(async () => {
    let currentTweet = "";
    let phrasesArray = [];
    let phrase = "//span[";

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, tweetId } = obj;

        if(type == "NEW"){
            currentTweet = tweetId;
            removeTweets();
        }
    });

    const getPhrases = async () => {
        const URL = "https://raw.githubusercontent.com/EbuOgden/TwitterBotHider/main/phrases.json";

        await fetch(URL)
            .then((response) => response.json())
            .then((json) => phrasesArray = json.data);

        let phrases = phrasesArray.map((element) => {
            return `contains(text(), "${element}")`
        }).join(" or ");

        phrase+= phrases+"]//ancestor::article";
    }

    const getElementsByXPath = (xpath, parent) => {
        let results = [];
        let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
            results.push(query.snapshotItem(i));
        }

        return results;
    }
    
    const removeTweets = () => {
        let nodes = getElementsByXPath(`${phrase}`);
        
        nodes.forEach(eachNode => {
            eachNode.childNodes.forEach(eachChildNode => {
                eachChildNode.remove();
            })
        });
    }

    window.onscroll = function (){
        removeTweets();
    }

    await getPhrases();
    removeTweets();

})();
