angular.module('Controllers', ['firebase', 'AuthService', 'MessageService', 'ProjectService', 'TrelloService', 'ui.router', 'mwl.calendar', 'ui.bootstrap'])

.run(['$rootScope', 'TrelloAPI', function($rootScope, TrelloAPI) {
  TrelloAPI.authorize(function(err, success) {
    $rootScope.$apply(function() {
      $rootScope.isAuthorized = true;
    });
  });
}])

/* ---- Navbar Controller ---- */
.controller('NavBarCtrl', ['$scope', 'Auth', function($scope, Auth, GoogleAuth) {

  $scope.alerts = [];

  $scope.login = function(provider) {
    Auth.login(provider);
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

/* ---- Home Controller ---- */
/* ---- Using Controller 'as' to use calendar ---- */
.controller('HomeCtrl', ['$scope', 'Messages', 'TrelloAPI', function($scope, Messages, TrelloAPI) {

  var vm = this;

  vm.boardId = '';

  $scope.changeBoard = function() {
    TrelloAPI.boardId = vm.boardId;
    if(vm.boardId) {
      console.log('Fetching Trello Data')
      TrelloAPI.getCards(function(err, cards) {
        if(!err) {
          var newEvents = [];
          cards.forEach(function(card) {
            var newEvent = {
              title: card.name,
              type: 'info',
              startsAt: moment(card.due).toDate()
            }
            newEvents.push(newEvent)
          });

          vm.events = newEvents;
          TrelloAPI.events = newEvents;
        } else {
          console.log(err);
        }
      });
    } else {
      vm.events = TrelloAPI.events;
    }
  }

  $scope.$watch('isAuthorized', function() {
    if($scope.isAuthorized) {
      if(!TrelloAPI.events && $scope.boardId) {
        console.log('Fetching Trello Data')
        TrelloAPI.getCards(function(err, cards) {
          if(!err) {
            var newEvents = [];
            cards.forEach(function(card) {
              var newEvent = {
                title: card.name,
                type: 'info',
                startsAt: moment(card.due).toDate()
              }
              newEvents.push(newEvent)
            });

            vm.events = newEvents;
            TrelloAPI.events = newEvents;
          } else {
            console.log(err);
          }
        });
      } else {
        vm.events = TrelloAPI.events;
      }
    }

    if(!TrelloAPI.boardId) {
      TrelloAPI.getBoards(function(err, data) {
        $scope.boards = data;
        TrelloAPI.boards = data;
      });
    } else {
      $scope.boards = TrelloAPI.boards
    }
  });

  // Calendar settings
  vm.calendarView = 'month';
  vm.calendarDate = new Date();
  vm.calendarTitle = 'GA Calendar';

  vm.messages = Messages.messages;
  vm.newMessageText = '';

  vm.addMessage = function() {
    Messages.addMessage($scope.newMessageText)
    $scope.newMessageText = '';
  }

  vm.addEvent = function() {
    $scope.events.push({title: 'Another Event', type: 'info', startsAt: moment().add(1, 'day').toDate()});
  }

  vm.getBoards = function() {
    TrelloAPI.getBoards(function(data) {
      console.log(data);
    });
  }
}])

/* ---- Profile Controller ---- */
.controller('ProfileCtrl', ['$scope', 'currentAuth', 'Projects', function($scope, currentAuth, Projects) {
  $scope.projects = null;

  Projects.init(function(snapshot) {
    $scope.projects = snapshot.val();
  });
}])

/* ---- Project Submit Controller ---- */
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
      console.log(error, data, type)
      if(type === 'success') {
        $state.go('profile');
      } else {
        $scope.alerts.push({type: type, message: error});
      }
    });
  }
}])

.controller('CreateClassCtrl', ['$scope', 'Classes', function($scope, Classes) {
  
}]);