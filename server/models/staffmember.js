module.exports = function (sequelize, DataTypes) {
  const StaffMember = sequelize.define('StaffMember', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 1,
          msg: 'Name should have at least 1 character.',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: 'Length of description must be not more than 100 chars.',
        },
      },
    },
    occupation: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    is_direct_contact: DataTypes.BOOLEAN,
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'The url address of photo in storage must be valid',
        },
      },
    },
    provider_id: DataTypes.INTEGER,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        StaffMember.belongsTo(models.Provider, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        });
      },
    },
  });
  return StaffMember;
};
