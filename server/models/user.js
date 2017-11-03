const bcrypt = require('bcrypt');

const UserRoles = require('../../config/database/enums/UserRoles.enum.json');
const { saltRounds } = require('../../config/auth/hash.config.json');

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      isUnique: true,
      validate: {
        notEmpty: {
          msg: "Login can't be empty.",
        },
      },
    },
    password_hash: DataTypes.STRING,
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      set(newPasswordValue) {
        this.setDataValue('password', newPasswordValue);
        this.setDataValue('password_hash', bcrypt.hashSync(newPasswordValue, saltRounds));
      },
      validate: {
        len: {
          args: 8,
          msg: 'Password must be 8 or more characters.',
        },
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isUnique: true,
      validate: {
        isEmail: {
          msg: 'Email address must be valid',
        },
        isUnique: sequelize.validateIsUnique('email', 'That address is being used. Please choose a different email address.'),
      },
      set(newEmailValue) {
        this.setDataValue('email', newEmailValue);
        this.setDataValue('is_verified', false);
      },
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    is_self_registered: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    last_online: {
      type: DataTypes.DATE,
    },
    role: {
      type: DataTypes.ENUM(UserRoles.RATER, UserRoles.PROVIDER, UserRoles.SUPPORTER, UserRoles.ADMIN),
      allowNull: false,
    },
    stripe_account_id: DataTypes.STRING,
    stripe_subscription: DataTypes.JSON,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        User.hasOne(models.Rater);
        User.hasOne(models.Provider);
        User.hasOne(models.NotificationSettingsList);
        User.hasMany(models.ProblemFeedbackReport);
      },
    },
  });
  return User;
};
