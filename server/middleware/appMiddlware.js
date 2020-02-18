const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
// setup global middleware here

module.exports = (app) => {
  app.use(morgan('dev')); // logging
  app.use(bodyParser.urlencoded({ extended: true })); // sending json to server
  app.use(bodyParser.json());
  app.use(cors()); // cors enabled
};