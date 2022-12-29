try {

    chrome.runtime.onInstalled.addListener(() => {
        // Page actions are disabled by default and enabled on select tabs
        chrome.action.disable();
      
        // Clear all rules to ensure only our expected rules are set
        chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
          // Declare a rule to enable the action on example.com pages
          let exampleRule = {
            conditions: [
              new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostSuffix: '.aws.amazon.com'},
              })
            ],
            actions: [new chrome.declarativeContent.ShowAction()],
          };
      
          // Finally, apply our new array of rules
          let rules = [exampleRule];
          chrome.declarativeContent.onPageChanged.addRules(rules);
        });
      });
      
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        
        if (changeInfo.status == "complete") {
            chrome.scripting.executeScript({
                files: ['contentScript.js'],
                target: { tabId: tab.id }
            })
        }
    })

    var keys = null;
    var imports = null;

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.method == 'setKeys')
            keys = message.keys;
        else if (message.method == 'getKeys')
            sendResponse(keys);
        else if (message.method == 'getImports'){
            sendResponse(imports);
            imports = null; //Clear imports
        }
        else if (message.method == 'setImports')
           imports = message.import;
    });

} catch (error) {
    console.log(error)
}