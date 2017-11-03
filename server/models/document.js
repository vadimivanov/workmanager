module.exports = function (sequelize, DataTypes) {
  const Document = sequelize.define('Document', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'The url address of file in storage must be valid',
        },
      },
    },
    provider_id: DataTypes.INTEGER,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        Document.belongsTo(models.Provider, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: true,
          },
        });
      },
    },
  });
  return Document;
};
