'use strict';

var app = angular.module('myApp', ['ui.router', 'satellizer']);

app.config(function($authProvider) {

    $authProvider.loginUrl = '/api/users/login'
    $authProvider.signupUrl = '/api/users/signup'

    $authProvider.facebook({
        clientId: '1058953380839845',
        url: '/api/users/facebook'
    })

    $authProvider.instagram({
        clientId: '4cf8baf61644407fb213d892216ee5b8'
    })

    $authProvider.github({
        clientId: '4cf8baf61644407fb213d892216ee5b8'
    })



})

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/html/home.html'
        })
        .state('login', {
            url: '/',
            templateUrl: '/html/loginregister.html',
            controller: 'loginregisterCtrl'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: '/html/profile.html',
            controller: 'profileCtrl',
            resolve: {
                CurrentUser: function(User) {
                    return User.getProfile();
                }
          }
        })
        .state('users', {
            url: '/users',
            templateUrl: '/html/users.html',
            controller: 'usersCtrl',
            resolve: {
                CurrentUsers: function(User) {
                    return User.getAll();
                }
          }
        })

        .state('user', {
            url: '/user/:userId',
            templateUrl: '/html/user.html',
        })
        .state('user.show', {
          url: '/',
          templateUrl: '/html/userShow.html',
          controller: 'userShowCtrl'
        })
        .state('edit', {
          url: '/profile/edit/:userId',
          templateUrl: '/html/editProfile.html',
          controller: 'editCtrl'
        })




    $urlRouterProvider.otherwise('/');
});
