angular.module('TrelloService', [])

.config(function() {
  Trello.authorize({
    type: 'popup',
    name: 'GA-LMS',
    scope: {
      read: true,
      write: true },
    expiration: 'never',
    success: this.authenticationSuccess,
    error: this.authenticationFailure
  });
})

.service('Trello', [function() {

  this.authSuccess = function() {
    console.log('Trello auth success');
    console.log(this);
  }

  this.authFailure = function() {
    console.log('Trello auth failure');
  }

  this.initCalendar = function(callback) {
    Trello.get('boards/57179c9c2c05a97c4b22e2d2/cards', function success(response) {
      //console.log(response);
      callback(null, response);
    }, function error(error) {
      //console.log(error);
      callback(error, null);
    });
  }

  this.getBoards = function() {
    Trello.get('members/me/boards', function success(response) {
      console.log(response);
    }, function error(error) {
      console.log(error);
    });
  }

  this.getCards = function(callback) {
    Trello.get('boards/57179c9c2c05a97c4b22e2d2/cards', function success(response) {
      //console.log(response);
      callback(null, response);
    }, function error(error) {
      //console.log(error);
      callback(error, null);
    });
  }  
}]);