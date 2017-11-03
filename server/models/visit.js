module.exports = function (sequelize, DataTypes) {
  const Visit = sequelize.define('Visit', {
    service: DataTypes.STRING,
    location_coordinates: DataTypes.JSON,
    provider_id: DataTypes.INTEGER,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        Visit.belongsTo(models.Provider, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        });
      },
    },
  });
  return Visit;
};
