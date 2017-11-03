const EventEmitter = require('events');

const { City, ZipCode, sequelize } = require('../models');

class ZipCityController extends EventEmitter {
  constructor() {
    super();

    this.getAllZipCodes = ({ zipPart = '', cityPart = '', offset, limit }) => ZipCode
      .findAll({
        offset,
        limit,
        subQuery: false,
        where: sequelize.and(
          sequelize.fn('LIKE', sequelize.col('zip'), `%${zipPart}%`),
          sequelize.fn('LIKE', sequelize.fn('lower', sequelize.col('Cities.city')), `%${cityPart}%`.toLowerCase())
        ),
        include: [City],
        order: [['created_at', 'ASC']],
      });

    this.getAllCities = ({ zipPart = '', cityPart = '', offset, limit }) => City
      .findAll({
        offset,
        limit,
        subQuery: false,
        where: sequelize.and(
          sequelize.fn('LIKE', sequelize.fn('lower', sequelize.col('city')), `%${cityPart}%`.toLowerCase()),
          sequelize.fn('LIKE', sequelize.col('ZipCode.zip'), `%${zipPart}%`)
        ),
        include: [ZipCode],
        order: [['created_at', 'ASC']],
      });
  }
}

module.exports = new ZipCityController();
