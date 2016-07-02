angular.module('Controllers', ['firebase', 'AuthService', 'MessageService', 'ProjectService', 'ui.router'])

.controller('NavBarCtrl', ['$scope', 'Auth', function($scope, Auth) {

  $scope.alerts = [];

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

.controller('ProfileCtrl', ['$scope', 'currentAuth', 'Projects', function($scope, currentAuth, Projects) {
  Projects.init(function(snapshot) {
    $scope.projects = snapshot.val();
  });
}])

.controller('ProjectCtrl', ['$scope', '$state', 'currentAuth', 'Projects', function($scope, $state, currentAuth, Projects) {
  $scope.newProject = {
    name: '',
    githubLink: '',
    deployLink: '',
    description: ''
  }

  $scope.newProjectVersion = 'project1';

  $scope.submitProject = function() {
    Projects.addProject($scope.newProject, $scope.newProjectVersion, function(error, data, type) {
      if(data) {
        $state.go('profile');
      } else {
        $scope.alerts.push({type: type, message: error});
      }
    });
  }
}]);