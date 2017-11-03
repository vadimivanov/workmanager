module.exports = function (sequelize, DataTypes) {
  const City = sequelize.define('City', {
    zip_code_id: DataTypes.INTEGER,
    city: DataTypes.STRING,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        City.belongsTo(models.ZipCode)
      },
    },
  });
  return City;
};
