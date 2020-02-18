const Tag = require('./tagModel');
const Post = require('../post/postModel');
const _ = require('lodash');

exports.params = async (req, res, next, id) => {
    // if there is id in params attach the post  to request object
    try {
        const tag = await Tag.findById(id);
        if (!tag) {
            throw new Error('Not found!');
          } else {
            req.tag = tag;
            next();
        }
    } catch (error) {
        next(error);
    }
};

exports.get = async (req, res, next) => {
    try {
        const tags = await Tag.find({});
        res.json(tags);
    } catch (error) {
        next(error);
    }
};

exports.getOne = async (req, res, next) => {
  const tag = req.tag;
  try {
    const tag = req.tag;
    const posts = await Post.find().where('tags').in([tag._id]).exec();
    
    res.json({tag, posts});

  } catch (error) {
    next(error);
  }
};

exports.put = async (req, res, next) => {
  const tag = req.tag;

  const body = {...tag, ...req.body};

  try {
    const updatedTag = await Tag.findByIdAndUpdate(tag._id, {$set: body}, {new: true})
    res.json(updatedTag);
  } catch (error) {
    next(error);
  }
  
};

exports.post = async (req, res, next)=> {
  const tag = new Tag({
    name: req.body.name
  });

  try {
    const savedTag = await tag.save();
    res.json(savedTag);
  } catch (error) {
    next(error);
  }
  
};

exports.delete = (req, res, next) => {
  req.tag.remove((err, removed) => {
    if (err) {
      next(err);
    } else {
      res.json(removed);
    }
  });
};