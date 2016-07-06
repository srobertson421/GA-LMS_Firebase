angular.module('AuthService', ['firebase', 'ui.router'])

.service('GoogleAuth', ['$rootScope', function($rootScope) {
  this.provider = new firebase.auth.GoogleAuthProvider();

  // Add scopes
  this.provider.addScope('https://www.googleapis.com/auth/calendar');

  this.login = function() {
    firebase.auth().signInWithPopup(this.provider).then(function(result) {
      // Gives you a Google access token, use it for the Google API
      var token = result.credential.accessToken;

      // The signed-in user info
      var user = result.user;

    }).catch(function(error) {
      console.log(error.code, error.message);
    });
  }
}])

.service('Auth', ['$firebaseAuth', '$firebaseArray', '$rootScope', '$state', function($firebaseAuth, $firebaseArray, $rootScope, $state) {
  var rolesRef = firebase.database().ref().child('roles');
  var roles = $firebaseArray(rolesRef);
  var auth = $firebaseAuth();
  this.AuthObj = auth;

  auth.$onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      $rootScope.user = firebaseUser;
      rolesRef.child(firebaseUser.uid).once('value').then(function(snapshot) {
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