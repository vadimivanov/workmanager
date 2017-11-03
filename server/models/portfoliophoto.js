module.exports = function (sequelize, DataTypes) {
  const PortfolioPhoto = sequelize.define('PortfolioPhoto', {
    photo_simple_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'The url address of photo in storage must be valid',
        },
      },
    },
    photo_before_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'The url address of photo in storage must be valid',
        },
      },
    },
    photo_after_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'The url address of photo in storage must be valid',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_marked_by_user_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_idea_for_inspiration: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    provider_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    inspiration_category_id: DataTypes.INTEGER,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        PortfolioPhoto.belongsTo(models.Provider, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        });
        PortfolioPhoto.belongsTo(models.Service, {
          onDelete: 'SET NULL',
          foreignKey: {
            allowNull: true,
          },
        });
        PortfolioPhoto.belongsTo(models.InspirationCategory, {
          onDelete: 'SET NULL',
          foreignKey: {
            allowNull: true,
          },
        });
      },
    },
  });
  return PortfolioPhoto;
};
