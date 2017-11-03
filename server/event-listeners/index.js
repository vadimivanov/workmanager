const fs = require('fs');
const path = require('path');

const basename = path.basename(module.filename);

//init all event listeners in this directory
module.exports = {
  initialize() {
    return Promise.all(fs
      .readdirSync(__dirname)
      .filter(file =>
      (file.indexOf('.') !== 0) &&
      (file !== basename) &&
      (file.slice(-3) === '.js'))
      .map(file => require(path.join(__dirname, file)).initialize())
    )
  },
};
