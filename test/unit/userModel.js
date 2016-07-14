'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const User = require('../../models/user');

before(done => {
  mongoose.connect('mongodb://localhost/sociallogindb-test', done)
});

after(done => {
  mongoose.disconnect(done);
});

beforeEach(done => {
  User.remove({}, function(err) {
    if(err) return done(err)
    let sampleUser = [{
      email: 'bob@bob.com',
      password: 'bob',
      displayName:'bob',
      
    }]
  })
})
