const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  published:{
    type:Boolean,
    default:false
  },
  slug:{
      type:String,
      unique: true
  },
  author: {type: Schema.Types.ObjectId, ref: 'user'},
  categories: [{type: Schema.Types.ObjectId, ref: 'category'}],
  tags:[{type: Schema.Types.ObjectId, ref: 'tag'}]
});

// create slug automaticaly upon save ** FIX THIS TO SLUG AFTER UPDATE TOO
PostSchema.pre('save', function(next) {
  let slug = this.title;

  slug = slug.replace(/^\s+|\s+$/g, ''); // trim
  slug = slug.toLowerCase();

  // remove accents, swap ñ for n, etc
  let from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  let to   = "aaaaaeeeeiiiioooouuuunc------";

  for (let i=0, l=from.length ; i<l ; i++) {
      slug = slug.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  slug = slug.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

  this.slug = slug;

  next();
});

module.exports = mongoose.model('post', PostSchema);