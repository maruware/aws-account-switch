"use strict";

class ChromeStorage {
	static get(key){
		return new Promise(
			function(resolve, reject){
				chrome.storage.local.get(key, function(result){
					resolve(result);
				});
			}
		);
	}

	static set(obj){
		return new Promise(
			function(resolve, reject){
				chrome.storage.local.set(obj, function(){
					resolve();
				});
			}
		);
	}
}


angular.module('App', [])
.controller('MainController', ['$scope', '$timeout', '$filter', function($scope, $timeout, $filter) {
	$scope.accounts = [];

	$scope.addAccount = function(){
		var newAccount = {
			'account': $scope.newAccount,
			'username': $scope.newUsername,
			'password': $scope.newPassword
		};
		var accounts = $filter('filter')($scope.accounts, function (account) {
	    return account.account == newAccount.account && account.username == newAccount.username;
	  });

	  if(accounts && accounts.length > 0){
	  	alert('This account has registed');
	  	return;
	  }
	  ChromeStorage.get("accounts")
	  .then(function(result){
	  	var accounts = result.accounts || [];
			accounts.push(newAccount);

			return $scope.saveAccount(accounts);
	  })
	  .then(function(){
	  	$scope.newUsername = ''
	  	$scope.newPassword = ''
	  });
	};

	$scope.saveAccount = function(accounts){
		return ChromeStorage.set({"accounts": accounts})
		.then(function(){
			return $scope.loadAccounts();
		});
	}

	$scope.loadAccounts = function(){
		return ChromeStorage.get("accounts")
		.then(function(result){
			return new Promise(function(resolve, reject){
				$timeout(function(){
					$scope.accounts = result.accounts;
					resolve();
				});
			});
		});
	}

	$scope.removeAccount = function(targetAccount){
		var accounts = $filter('filter')($scope.accounts, function (account) {
	    return account !== targetAccount;
	  });
		return $scope.saveAccount(accounts);
	};

	$scope.applyAccount = function(account){
		var bg = chrome.extension.getBackgroundPage();
		bg.applyAccount(account);
	}

	return $scope.loadAccounts();
}]);
