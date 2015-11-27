chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if(request.cmd == 'applyAccount'){
  		document.getElementById('account').value = request.account.account;
  		document.getElementById('username').value = request.account.username;
  		document.getElementById('password').value = request.account.password;
  	}

  	sendResponse('finish');
  }
);