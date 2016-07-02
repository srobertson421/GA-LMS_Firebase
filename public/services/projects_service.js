angular.module('ProjectService', ['firebase'])

.service('Projects', ['$firebaseArray', '$rootScope', function($firebaseArray, $rootScope) {
  var ref = firebase.database().ref().child('projects');
  var userProjects = ref.child($rootScope.user.uid);

  this.init = function(callback) {
    if(callback) {
      userProjects.on('value', callback);
    } else {
      userProjects.on('value', function(snapshot) {
        var data = snapshot.val();
        if(!data) {
          userProjects.set({
            project1: {
              name: 'Project1'
            },
            project2: {
              name: 'Project2'
            },
            project3: {
              name: 'Project3'
            },
            project4: {
              name: 'Project4'
            }
          })
        }
      });
    }
  }

  this.addProject = function(newProject, projectVersion, callback) {
    console.log('Adding project');
    var updateObj = {};
    updateObj[projectVersion.toLowerCase()] = newProject;
    console.log(updateObj);
    userProjects.update(updateObj).then(function(project) {
      callback(null, project, 'success');
    }, function(error) {
      callback(error, null, 'error');
    });
  }
}]);