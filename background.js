function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.match(/https:\/\/signin.aws.amazon.com\/.*/)) {
    chrome.pageAction.show(tabId);
  }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

var applyAccount = function(account){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        'cmd': 'applyAccount',
        'account': account
      }, function(res){
        console.log(res);
      }
    );
  });
};