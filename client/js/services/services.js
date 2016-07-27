'use strict';

var app = angular.module('myApp');


app.service('User', function($http, $q) {


  this.getAll = () => {
    return $http.get('/api/users')
    .then(res => {
      return $q.resolve(res.data)
    })
  }

  this.getProfile = () => {
    return $http.get('/api/users/profile')
    .then(res => {
      console.log('profile res', res);
      return $q.resolve(res.data);
    })
  }

  this.getById = id => $http.get(`/api/users/${id}`);

  this.updateProfile = (id, userObj) => $http.put(`/api/users/${id}`, userObj)

  this.postMessage = (id, messageObj) => $http.put(`/api/users/${id}`, messageObj)
})
