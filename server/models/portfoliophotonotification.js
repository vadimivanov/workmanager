module.exports = function (sequelize, DataTypes) {
  const PortfolioPhotoNotification = sequelize.define('PortfolioPhotoNotification', {
    portfolio_photo_id: DataTypes.INTEGER,
    prev_portfoliophoto: DataTypes.JSON,
    is_viewed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        PortfolioPhotoNotification.belongsTo(models.PortfolioPhoto, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: true,
          },
        })
      },
    },
  });
  return PortfolioPhotoNotification;
};
