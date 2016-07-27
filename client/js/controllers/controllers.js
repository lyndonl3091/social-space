'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, $auth) {
  console.log('mainCtrl!');

  $scope.isAuthenticated = () => $auth.isAuthenticated();

  $scope.logOut = () => {
    $auth.logout();
    $state.go('login');
  }

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
      .then(res => {
        console.log('res:', res);
        $state.go('home');
      })
      .catch(err => {
        console.log('err:', err);
      })
  };
});

app.controller('loginregisterCtrl', function($scope, $state, $auth) {
  console.log('loginregisterCtrl!');

  $scope.userLogin = () => {
    $auth.login($scope.user)
    .then(res => {
      $state.go('profile')
    })
    .catch(err => {
      console.log('err:', err);
    })
  }

  $scope.register = () => {
    if($scope.newUser.password !== $scope.newUser.password2) {
      $scope.newUser.password = null;
      $scope.newUser.password2 = null;
      alert('Passwords must match.  Try again.')
    } else {
      console.log('$scope.newUser', $scope.newUser)
      $auth.signup($scope.newUser)
      .then(res => {
        $auth.login($scope.newUser)
        .then(res => {
          $state.go('profile')
        })
      })
      .catch(err => {
        console.log('err:', err);
      })
    }
  }
})

app.controller('profileCtrl', function($scope, $state, User, CurrentUser) {
    console.log('profileCtrl!');

    $scope.user = CurrentUser;

    $scope.editProfile = id => {
      console.log('Click!');
      console.log('user id', id);
      $state.go('edit', {userId: id})
    }


})

app.controller('usersCtrl', function($scope, $state, User, CurrentUsers) {
    console.log('usersCtrl!');

    $scope.users = CurrentUsers;

    $scope.goToUser = id => {
      $state.go('user.show', {userId: id});
    }

})

app.controller('editCtrl', function($scope, $state, $stateParams, User) {
    console.log('editCtrl!');

    $scope.updateProfile = () => {
      User.updateProfile($stateParams.userId, $scope.user)
      .then(res => {
        $state.go('profile')
      })
    }


})

app.controller('userShowCtrl', function($scope,$state, $stateParams, User) {
    console.log('userShowCtrl!');

    User.getById($stateParams.userId)
    .then(res => {
      $scope.user = res.data;
    })
    .catch (err => {
      console.error('err:', err);
    })

    $scope.sendMessage = () => {
      User.postMessage($stateParams )
      .then(res => {
        console.log('res', res.data);
      })
    }


})
