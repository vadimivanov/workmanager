module.exports = function (sequelize, DataTypes) {
  const Subservice = sequelize.define('Subservice', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    metatags: DataTypes.ARRAY(DataTypes.STRING),
    service_id: DataTypes.INTEGER,
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        Subservice.belongsToMany(models.Provider, { through: 'ProviderSubservice' });
        Subservice.belongsTo(models.Service, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        });
      },
    },
  });
  return Subservice;
};
