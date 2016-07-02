var app = angular.module('lms', ['firebase', 'ui.router', 'Controllers', 'AuthService'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');

  //define routes
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'views/profile.html',
    controller: 'ProfileCtrl',
    resolve: {
      "currentAuth": ['Auth', function(Auth) {
        return Auth.AuthObj.$requireSignIn();
      }]
    }
  })
  .state('submitProject', {
    url: '/submit-project',
    templateUrl: 'views/submit_project.html',
    controller: 'ProjectCtrl',
    resolve: {
      "currentAuth": ['Auth', function(Auth) {
        return Auth.AuthObj.$requireSignIn();
      }]
    }
  });

  //$locationProvider.html5Mode(false).hashPrefix('!');
  $locationProvider.html5Mode(true);
}])

.run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      console.log('Not signed in for route');
      $state.go("home");
    }
  });
}]);