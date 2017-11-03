const { getAllModelsNames, setTableIdSequenceNextValue } = require('../helpers');

const MIN_ID_VALUE = 1000;

const setIDsNextValues = () => Promise.all(
  getAllModelsNames()
    .map(modelName => setTableIdSequenceNextValue(modelName.tableName, MIN_ID_VALUE))
);

module.exports = {
  up(queryInterface, Sequelize) {
    console.log('Post seed hook starting');

    return Promise.all([setIDsNextValues()]);
  },

  down(queryInterface, Sequelize) {
    return Promise.resolve(0);
  },
};
