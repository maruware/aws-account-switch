angular.module('App', [])
.controller('MainController', ['$scope', '$timeout', '$filter', function($scope, $timeout, $filter) {
	$scope.accounts = [];

	$scope.addAccount = function(){
		//すでに存在するものは追加しない
		chrome.storage.local.get("accounts", function(result){
			var accounts = result.accounts || [];
			accounts.push({
				'account': $scope.newAccount,
				'username': $scope.newUsername,
				'password': $scope.newPassword
			});

			$scope.saveAccount(accounts);
		});
	};

	$scope.saveAccount = function(accounts){
		chrome.storage.local.set({"accounts": accounts}, function(){
			$scope.loadAccounts();
		});
	}

	$scope.loadAccounts = function(){
		chrome.storage.local.get("accounts", function(result){
			$timeout(function(){
				$scope.accounts = result.accounts;
			});
		});
	}

	$scope.removeAccount = function(targetAccount){
		accounts = $filter('filter')($scope.accounts, function (account) {
	    return account !== targetAccount;
	  });
		$scope.saveAccount(accounts);
	};

	$scope.applyAccount = function(account){
		var bg = chrome.extension.getBackgroundPage();
		bg.applyAccount(account);
	}

	$scope.loadAccounts();
}]);
