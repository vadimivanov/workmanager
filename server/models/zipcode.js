module.exports = function (sequelize, DataTypes) {
  const ZipCode = sequelize.define('ZipCode', {
    zip: DataTypes.STRING,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        ZipCode.hasMany(models.City)
      },
    },
  });
  return ZipCode;
};
