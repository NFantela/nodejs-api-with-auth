const User = require('../api/user/userModel');
const Post = require('../api/post/postModel');
const Category = require('../api/category/categoryModel');
const Tag = require('../api/tag/tagModel');
const {ObjectID} = require('mongodb');
const logger = require('./logger');

logger.log('Seeding the Database');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {_id: userOneId, email: 'nfantela@gmail.com', name: 'Niksa', password: 'secret'},
  {_id: userTwoId, email: 'master@gmail.com', name: 'Master Blaster', password: 'secret'},
];

const categoryOneId = new ObjectID();
const categoryTwoId = new ObjectID(); 

const categories = [
  {_id: categoryOneId, name: 'Food'},
  {_id: categoryTwoId, name: 'Travel'},
];

const tagOneId = new ObjectID();
const tagTwoId = new ObjectID(); 
const tagThreeId = new ObjectID();
const tagFourId = new ObjectID(); 

const tags = [
  {_id: tagOneId, name: 'Pasta'},{_id: tagThreeId, name: 'Tomato'},
  {_id: tagTwoId, name: 'Seychelles'}, {_id: tagFourId, name: 'Croatia'}, 
]

const posts = [
  {
    title: 'Best spaghetti recipe', 
    text: 'Another one of great recipces from kitchen...',
    categories:[categoryOneId],
    tags:[tagOneId, tagThreeId]
  },
  {
    title: 'Great tropical wedding', 
    text: 'We are talking about Seychelles ofcourse...',
    categories:[categoryTwoId],
    tags:[tagTwoId]
  },
];



const cleanDB = function() {
  logger.log('... cleaning the DB');
  var cleanPromises = [User, Category, Post, Tag]
    .map(function(model) {
      return model.remove().exec();
    });
  return Promise.all(cleanPromises);
}

const createUsers = () => {
  const userOne = new User(users[0]).save();
  const userTwo = new User(users[1]).save();

  return Promise.all([userOne, userTwo]);
}
const createCategories = () => {
  const categoryOne = new Category(categories[0]).save();
  const categoryTwo = new Category(categories[1]).save();

  return Promise.all([categoryOne, categoryTwo]);
}
createTags = () => {
  const tagOne = new Tag(tags[0]).save();
  const tagTwo = new Tag(tags[1]).save();
  const tagThree = new Tag(tags[3]).save();
  const tagFour = new Tag(tags[4]).save();

  return Promise.all([tagOne, tagTwo, tagThree, tagFour]);
}
createPosts = () => {
  const postOne = new Post(posts[0]).save();
  const postTwo = new Post(posts[1]).save();

  return Promise.all([postOne, postTwo]);
}


cleanDB()
  .then(createUsers)
  .then(createCategories)
  .then(createTags)
  .then(createPosts)
  .then(logger.log.bind(logger))
  .catch(logger.log.bind(logger));