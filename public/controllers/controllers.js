angular.module('Controllers', ['firebase', 'AuthService', 'MessageService'])

.controller('NavBarCtrl', ['$scope', 'Auth', function($scope, Auth) {

  $scope.login = function() {
    Auth.login('github');
  }

  $scope.logout = function() {
    Auth.logout();
  }

  $scope.userRole = function() {
    if($scope.user && $scope.user.role === 'user') {
      return true;
    } else {
      return false;
    }
  }

  $scope.adminRole = function() {
    if($scope.user && $scope.user.role === 'admin') {
      return true;
    } else {
      return false;
    }
  }
}])

.controller('HomeCtrl', ['$scope', 'Messages', function($scope, Messages) {

  $scope.messages = Messages.messages;
  $scope.newMessageText = '';

  $scope.addMessage = function() {
    Messages.addMessage($scope.newMessageText)
    $scope.newMessageText = '';
  }
}])

.controller('ProfileCtrl', ['$scope', 'currentAuth', function($scope, currentAuth) {
  console.log(currentAuth);
}]);