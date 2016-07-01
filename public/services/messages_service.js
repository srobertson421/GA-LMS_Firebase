angular.module('MessageService', ['firebase'])

.service('Messages', ['$firebaseArray', function($firebaseArray) {
  var ref = firebase.database().ref().child('messages');
  this.messages = $firebaseArray(ref);

  this.addMessage = function(message) {
    this.messages.$add({
      text: message
    })
  }
}]);