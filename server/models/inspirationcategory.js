module.exports = function (sequelize, DataTypes) {
  const InspirationCategory = sequelize.define('InspirationCategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      isUnique: true,
      validate: {
        isUnique: sequelize.validateIsUnique('name', 'The name of inspiration category must be unique.'),
      },
    },
    description: DataTypes.TEXT,
    is_show_on_home_page: DataTypes.BOOLEAN,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        InspirationCategory.hasMany(models.PortfolioPhoto);
      },
    },
  });
  return InspirationCategory;
};
