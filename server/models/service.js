module.exports = function (sequelize, DataTypes) {
  const Service = sequelize.define('Service', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      isUnique: true,
      validate: {
        isUnique: sequelize.validateIsUnique('name', 'The name of category must be unique.'),
      },
    },
    description: DataTypes.TEXT,
    metatags: DataTypes.ARRAY(DataTypes.STRING),
    rating: DataTypes.INTEGER,
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        Service.hasMany(models.Subservice);
      },
    },
  });
  return Service;
};
