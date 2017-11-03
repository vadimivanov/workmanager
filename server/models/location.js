module.exports = function (sequelize, DataTypes) {
  const Location = sequelize.define('Location', {
    name: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    street: {
      type: DataTypes.STRING,
    },
    house_number: {
      type: DataTypes.STRING,
    },
    zip_code: {
      type: DataTypes.INTEGER,
    },
    location_coordinates: {
      type: DataTypes.GEOMETRY('POINT'),
      get() {
        const [lng, lat] = this.getDataValue('location_coordinates').coordinates;
        return { lat, lng };
      },
      set({ lng, lat }) {
        this.setDataValue('location_coordinates', { type: 'Point', coordinates: [lng, lat] });
      },
      validations: {
        isCoordinateArray(value) {
          if (!_.isArray(value) || value.length !== 2) {
            throw new Error('Must be an array with 2 elements');
          }
        },
      },
    },
    provider_id: DataTypes.INTEGER,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        Location.belongsTo(models.Provider, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        });
      },
    },
  });
  return Location;
};
