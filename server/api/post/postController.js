const Post = require('./postModel');
const _ = require('lodash');

exports.params = async (req, res, next, id) => {
    // if there is id in params attach the post  to request object
    try {
        const post = await Post.findById(id).populate('author').exec();

        if (!post) {
            throw new Error('Not found!');
          } else {
            req.post = post;
            next();
        }
    } catch (error) {
        next(error);
    }
};

exports.get = async (req, res, next) => {
    try {
        const posts = await Post.find({})
          .populate({ path: 'author', select: ['_id', 'email', 'name', 'role'] })
          .populate('categories')
          .populate('tags')
          .exec();

        res.json(posts);
    } catch (error) {
        next(error);
    }
};

exports.getOne = (req, res, next) => {
  // we already have the post in req so we will just return it
  const post = req.post;
  res.json(post);
};

exports.put = async (req, res, next) => {
  const post = req.post;

  const body = {...post, ...req.body};

  try {
    const updatedPost = await Post.findByIdAndUpdate(post._id, {$set: body}, {new: true})
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
  
};

exports.post = async (req, res, next)=> {
  const post = new Post({
    title: req.body.title,
    text: req.body.text,
    published: req.body.published,
    categories: req.body.categories,
    tags:req.body.tags
  });

  post.author = req.user._id;

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (error) {
    next(error);
  }
  
};

exports.delete = (req, res, next) => {
  req.post.remove((err, removed) => {
    if (err) {
      next(err);
    } else {
      res.json(removed);
    }
  });
};