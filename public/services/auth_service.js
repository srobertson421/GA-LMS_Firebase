angular.module('AuthService', ['firebase', 'ui.router'])

.service('Auth', ['$firebaseAuth', '$firebaseArray', '$rootScope', '$state', function($firebaseAuth, $firebaseArray, $rootScope, $state) {
  var rolesRef = firebase.database().ref().child('roles');
  var roles = $firebaseArray(rolesRef);
  var auth = $firebaseAuth();
  this.AuthObj = auth;

  auth.$onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      $rootScope.user = firebaseUser;
      console.log('Logged In', firebaseUser.uid);
      rolesRef.child(firebaseUser.uid).once('value').then(function(snapshot) {
        console.log(snapshot.val());
        var data = snapshot.val();
        if(!data) {
          rolesRef.child(firebaseUser.uid).set({
            role: 'user'
          });
        } else {
          $rootScope.user.role = data.role;
        }
      });
    } else {
      $rootScope.user = null;
      $state.go('home');
      console.log('Logged Out');
    }
  });

  this.login = function(provider) {
    auth.$signInWithPopup(provider).then(function(firebaseUser) {
      console.log("Signed in as:", firebaseUser.uid);
      return firebaseUser.uid;
    }).catch(function(error) {
      console.log("Authentication failed:", error);
      return error;
    });
  }

  this.logout = function() {
    auth.$signOut();
  }
}]);