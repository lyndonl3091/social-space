'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

let messageSchema = new mongoose.Schema ({
  user: String,
  message: String,
  postedAt: {type: Date, default: Date.now()}
})


let userSchema = new mongoose.Schema({
  email: String,
  password: String,
  displayName: String, // their name
  profileImage: String,
  messages: [messageSchema],
  facebook: String  // Facebook profile id
});


userSchema.statics.authMiddleware = function(req, res, next) {

  let tokenHeader = req.headers.authorization;
  console.log('tokenHeader:', tokenHeader);

  if(!tokenHeader) {
    return res.status(401).send({error: 'Missing authorization header.'});
  }

  let token = tokenHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if(err) return res.status(401).send(err);

    User.findById(payload._id, (err, user) => {
      if(err || !user) return res.status(401).send(err || {error: 'User not found.'});

      req.user = user;

      next();
    }).select('-password');
  });
};


userSchema.methods.generateToken = function() {
  let payload = {
    _id: this._id
  };

  let token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1 day'});

  return token;
};

userSchema.statics.register = function(userObj, cb) {

  this.findOne({email: userObj.email}, (err, user) => {
    if(err || user) return cb(err || {error: 'A user already exists with this email address.'});

    this.create(userObj, (err, savedUser) => {
      if(err) return cb(err);

      let token = savedUser.generateToken();

      cb(null, token);
    });
  });
};

userSchema.pre('save', function(next) {

  // 'this' is the user document
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 12, (err, hash) => {
    this.password = hash;
    next();
  });
});

userSchema.statics.authenticate = function(userObj, cb) {

  this.findOne({email: userObj.email})
    .exec((err, user) => {
      if(err) return cb(err);

      if(!user) {
        return cb({error: 'Invalid email or password.'});
      }
      //           ( password attempt,   db hash )
      bcrypt.compare(userObj.password, user.password, (err, isGood) => {
        if(err || !isGood) return cb(err || {error: 'Invalid email or password.'});

        let token = user.generateToken();

        cb(null, token);
      });
    });
};

let User = mongoose.model('User', userSchema);

module.exports = User;
