const Category = require('./categoryModel');
const Post = require('../post/postModel');
const _ = require('lodash');

exports.params = async (req, res, next, id) => {
    // if there is id in params attach the category to request object
    try {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Not found!');
          } else {
            req.category = category;
            next();
        }
    } catch (error) {
        next(error);
    }
};

exports.get = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

exports.getOne = async(req, res, next) => {
  try {
    const category = req.category;
    const posts = await Post.find().where('categories').in([category._id]).exec();
    
    res.json({category, posts});

  } catch (error) {
    next(error);
  }

};

exports.put = async (req, res, next) => {
  const category = req.category;

  const body = {...category, ...req.body};

  try {
    const updatedCategory = await Category.findByIdAndUpdate(category._id, {$set: body}, {new: true})
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
  
};

exports.post = async (req, res, next)=> {
  const category = new Category({
    name: req.body.name,
    description: req.body.description 
  });

  try {
    const savedCategory = await category.save();
    res.json(savedCategory);
  } catch (error) {
    next(error);
  }
  
};

exports.delete = (req, res, next) => {
  req.category.remove((err, removed) => {
    if (err) {
      next(err);
    } else {
      res.json(removed);
    }
  });
};