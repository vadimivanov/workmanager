const fs = require('fs');
const bcrypt = require('bcrypt');

const models = require('../../models');
const { saltRounds } = require('../../../config/auth/hash.config.json');

module.exports = {
  addTimestamp: Sequelize => model => Object.assign({},
    model,
    {
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW'),
    }
  ),

  addYear: Sequelize => model => Object.assign({},
    model, {
      foundation_year: Sequelize.fn('NOW'),
    }),

  addGeometryPoint: Sequelize => model => (Object.assign({}, model, { location_coordinates: Sequelize.fn('ST_GEOMFROMTEXT', `POINT(${model.location_coordinates.lng} ${model.location_coordinates.lat})`) })),

  setIndexThroughArrayIndex: (model, index) => (Object.assign({ id: (index + 1) }, model)),

  getAllModelsNames: () => Object.keys(models)
    .filter(modelsObjKey => models[modelsObjKey].tableName !== undefined)
    .map(modelName => models[modelName]),

  setTableIdSequenceNextValue: tableName => models.sequelize.query(`select setval('"${tableName}_id_seq"', (select max("${tableName}".id)+1 from "${tableName}"), false)`),

  setPasswordHashAndDeletePassword: (model) => {
    const clonedModel = Object.assign({}, model, { password_hash: bcrypt.hashSync(model.password, saltRounds) });
    delete clonedModel.password;
    return clonedModel;
  },

  createZipCitiesFromFile: (zipCities) => {
    // const zipCities = fs.readFileSync(path, 'ascii');

    class CityZip {
      constructor(city, zip) {
        this.city = city;
        this.zip = zip;
      }
    }

    let zipId = 1;
    let cityId = 1;

    // const CityZipPairs = zipCities
    //   .split('\r\n')
    //   .map(zipCity => zipCity.split(';'))
    //   .map(([city, zip]) => new CityZip(city, zip));

    const CityZipPairs = zipCities
      .map(({ city, zip }) => new CityZip(city, zip));

    const uniqueZips = Array.from(new Set(CityZipPairs.map(({ zip }) => zip)));
    const Zips = uniqueZips.map(zip => ({ zip, id: zipId++ }));
    const Cities = CityZipPairs.map(({ city, zip }) => ({
      city,
      id: cityId++,
      zip_code_id: Zips.find(uniqueZip => uniqueZip.zip === zip).id,
    }));

    return ({
      zipCodes: Zips,
      cities: Cities,
    })
  },
};
