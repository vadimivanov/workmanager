
module.exports = function (sequelize, DataTypes) {
  const Provider = sequelize.define('Provider', {
    company_name: {
      type: DataTypes.STRING,
    },
    telephone_number: DataTypes.STRING,
    contact_person_info: DataTypes.JSON,
    info_files_urls: DataTypes.ARRAY(DataTypes.STRING),
    contact_information: {
      type: DataTypes.JSON,
    },
    general_news: DataTypes.TEXT,
    about: DataTypes.TEXT,
    number_of_employees: DataTypes.INTEGER,
    foundation_year: DataTypes.DATE,
    hours_of_operation: DataTypes.JSON,
    rating: DataTypes.FLOAT,
    photo_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'The url address of photo in storage must be valid',
        },
      },
    },
    user_id: DataTypes.INTEGER,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        Provider.hasMany(models.Feedback);
        Provider.hasMany(models.FeedbackRequest);
        Provider.hasMany(models.StaffMember);
        Provider.hasMany(models.Document);
        Provider.hasMany(models.Location);
        Provider.hasMany(models.Visit);
        Provider.belongsToMany(models.Subservice, { through: 'ProviderSubservice' });
        Provider.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        })
      },
    },
  });
  return Provider;
};
