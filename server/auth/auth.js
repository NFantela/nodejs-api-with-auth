const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../config/config');
const checkToken = expressJwt({ secret: config.secrets.jwt });
const User = require('../api/user/userModel');

// middleware to check the token on incoming requests
exports.decodeToken = () => {
  return (req, res, next) => {
    // make it optional to place token on query string
    // if it is, place it on the headers where it should be
    // so checkToken can see it. See follow the 'Bearer 034930493' format so checkToken can see it and decode it
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }

    // this will call next if token is valid
    // and send error if its not. It will attached the decoded token to req.user
    checkToken(req, res, next);
  };
};

exports.getFreshUser = () => {
  return async (req, res, next) => {
      try {
        const user = await User.findById(req.user._id);
        if (!user) {
          // if a user is not found either deleted or never existed
          res.status(401).send('Unauthorized');
        } else {
          // update req.user with fresh user from stale token data
          req.user = user;
          next();
        }
      } catch (error) {
        next(error);
      }
  }
};

exports.isAdmin = (req, res, next) => { 
    if(req.user.role !== 'Administrator'){
      return res.status(401).send('Unauthorized - higher role required!');
    } 
    next();
}


exports.verifyUser = () => {
  return async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // if no email or password then send
    if (!email || !password) {
      res.status(400).send('You need a email and password');
      return;
    }

    try {
      const user = await User.findOne({email});
      if (!user) {
        res.status(401).send('No user with the given email');
      } else {
        // checking the passowords here
        if (!user.authenticate(password)) {
          res.status(401).send('Wrong password');
        } else {
          // and call next so the controller  can sign a token from the req.user._id
          req.user = user;
          next();
        }
      }
    } catch (error) {
      next(error);
    }

  };
};

// util method to sign tokens on signup
exports.signToken = ({_id, email}) => {
  return jwt.sign(
    {_id, email},
    config.secrets.jwt,
    {expiresInMinutes: config.expireTime}
  );
};