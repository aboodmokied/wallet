//=> models loader
// it will automatically define all models defined in "models" folder without the need for require them 
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

// Read all files in the models directory, excluding this index.js file
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
        require(path.join(__dirname, file));
  });