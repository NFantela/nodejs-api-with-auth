const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug:{
      type:String,
      unique: true
  }
});

// create slug automaticaly upon save ** FIX THIS TO SLUG AFTER UPDATE TOO
TagSchema.pre('save', function(next){
  let slug = this.name;

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

module.exports = mongoose.model('tag', TagSchema);