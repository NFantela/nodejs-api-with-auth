const User = require('./userModel');
const Post = require('../post/postModel');
const _ = require('lodash');
const signToken = require('../../auth/auth').signToken;

exports.params = async (req, res, next, id) => {
    try {
        const user = await User.findById(id).select('-password').exec(); // everything EXCEPT password
        if (!user) {
            throw new Error('Not found!');
          } else {
            req.user = user;
            next();
        }
    } catch (error) {
        next(error);
    }
};

exports.get = async (req, res, next) => {
    try {
        const users = await User.find({})
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.getOne = async (req, res, next) => {

  try {
    const user = req.user;
    const posts = await Post.find().where('author').in([user._id]).exec();
    
    res.json({user, posts});

  } catch (error) {
    next(error);
  }
};

exports.put = async (req, res, next) => {

  const user = req.user;

  const update = {...user, ...req.body};

  try {
    const updatedUser = await User.findByIdAndUpdate(user._id, {$set: update}, {new: true})
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

exports.post = async (req, res, next) => {
  const newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    role: req.body.role
  });

  try {
    const savedUser = await newUser.save();
    res.json({_id: savedUser._id, email: savedUser.email, name: savedUser.name, role: savedUser.role});
  } catch (error) {
    next(error);
  }
};

exports.delete = (req, res, next) =>  {
  req.user.remove(function(err, removed) {
    if (err) {
      next(err);
    } else {
      res.json(removed);
    }
  });
};