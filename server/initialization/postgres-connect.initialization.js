const log = require('../utils/logger/logger')(module);

// process.env.DATABASE_URL = 'postgres://rorkirpezukztl:fe2b636d4a18a49c9824c71c0a94dfa9ab8a63c8eb53280cc08eecdfdc89d3c1@ec2-54-217-235-11.eu-west-1.compute.amazonaws.com:5432/d1k2c363eahrl5?sslmode=require';
process.env.DATABASE_URL = 'postgres://admin:GJJDFHTIUODLQIGQ@aws-us-east-1-portal.6.dblayer.com:24747/compose?sslmode=require';

const env = process.env.NODE_ENV || 'development';
const config = require('./../../config/database/postgres.config.json')[env];
const models = require('./../models/');

module.exports = models.sequelize
  .authenticate()
  .then(() => log.info(`Connection successful to ${env} DB ${config.use_env_variable
    ? process.env[config.use_env_variable]
    : config.database
    }`))
  .then(models.sequelize.sync())
  .catch(error => log.info('Error creating connection:', error));
