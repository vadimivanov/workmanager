const HttpStatus = require('http-status-codes');
const _ = require('lodash/fp');
const { Form } = require('multiparty');
const fs = require('fs');

const log = require('../../utils/logger/logger')(module);
const eventBus = require('../../utils/event-bus');
const eventTypes = require('../../../config/event-types.config.json');

const INDEX_OF_FILE = 0;

class RouterUtils {
  constructor() {
    /**
     * Parse request according to Content-type header.
     * @param req {object}
     * @param parseMultipartFormDataPromise {Promise=}
     * @param parseApplicationJsonPromise {Promise=}
     * @return {Promise}
     */
    this.getBodyByContentType = (req, parseMultipartFormDataPromise, parseApplicationJsonPromise) => {
      const parseMultipartFormData = parseMultipartFormDataPromise || this.getParsedFormData;
      const parseApplicationJson = parseApplicationJsonPromise || (request => Promise.resolve(request.body));

      if (/multipart\/form-data/i.test(req.headers['content-type'])) {
        return parseMultipartFormData(req);
      } else if (/application\/json/i.test(req.headers['content-type'])) {
        return parseApplicationJson(req);
      }
    };

    /**
     * Respond with appropriate payload.
     * 204 if empty or
     * 200 and actual payload.
     * Transform if transform function exists
     *
     * @param res - express response obj
     * @param payloadTransform {function}
     */
    this.respondPayload = (res, payloadTransform = p => p) => (payload) => {
      if (_.isEmpty(payload)) {
        res.status(HttpStatus.NO_CONTENT).end();
      } else {
        res.send(payloadTransform(payload));
      }
    };

    /**
     * Handle db promise and respond with its payload
     *
     * @param res - express response obj
     */
    this.respondError = res => (err) => {
      log.error(err.message);
      res.status(HttpStatus.BAD_REQUEST).send({ message: err.message });
    };

    /**
     * Sending file to the frontend
     *
     * @param res - express response obj
     * @param fileName - specific part name of fields
     * @param fileTransform {function}
     */
    this.respondFile = (res, fileName, fileTransform = f => f) => (file) => {
      if (_.isEmpty(file)) {
        res.status(HttpStatus.NO_CONTENT).end();
      } else if (!_.isEmpty(file.original_file_name)) {
        const FILE_TYPE = _.last(file.original_file_name.split('.'));
        res.type(FILE_TYPE).status(HttpStatus.OK).send(fileTransform(file.photo));
      } else {
        const FILE_TYPE = _.last(file[`${fileName}_original_file_name`].split('.'));
        res.type(FILE_TYPE).status(HttpStatus.OK).send(fileTransform(file[`photo_${fileName}`]));
      }
    };

    /**
     * Downloading file in the frontend
     *
     * @param res - express response obj
     * @param fileTransform {function}
     */
    this.respondFileDownload = (res, fileTransform = p => p) => (file) => {
      if (_.isEmpty(file)) {
        res.status(HttpStatus.NO_CONTENT).end();
      } else {
        const FILE_TYPE = _.last(file.original_file_name.split('.'));
        res.setHeader('Content-type', 'application/octet-stream');
        res.setHeader('Content-disposition', `attachment; filename=${file.name}.${FILE_TYPE}`);
        res.send(fileTransform(file.file));
      }
    };

    /**
     * Parsing of request object
     * and getting files from formData
     *
     * @param req - express request object
     * @returns {Promise} - object if getting one file or array of objects if getting more then one file
     */
    this.getParsedFormData = req => new Promise((resolve, reject) => {
      const form = new Form();
      const checkName = (arrayOfFiles, fields, fileIndex) => {
        return _.isEmpty(fields.name) ? _.first(arrayOfFiles[fileIndex].originalFilename.split('.')) : _.first(fields.name);
      };

      const createNewFile = (fields, arrayOfFiles, fileBuffer, fileIndex) => {
        const newFile = {
          name: checkName(arrayOfFiles, fields, fileIndex),
          original_file_name: arrayOfFiles[fileIndex].originalFilename,
          file: fileBuffer,
        };
        const newFields = {};
        for (const field in fields) {
          newFields[`${field}`] = _.first(fields[`${field}`]);
        }
        return Object.assign({}, newFields, newFile);
      };

      const getFileBuffer = (err, fields, files) => {
        if (!err) {
          const gettingFiles = files.files;
          if (gettingFiles.length === 1) {
            fs.readFile(gettingFiles[INDEX_OF_FILE].path, (err, fileBuffer) => {
              if (!err) {
                resolve(createNewFile(fields, gettingFiles, fileBuffer, INDEX_OF_FILE));
              } else {
                log.error(err.message);
                reject(err);
              }
            });
          } else if (gettingFiles.length > 1) {
            const arrayOfNewFiles = [];
            for (let i = 0; i < gettingFiles.length; i++) {
              fs.readFile(gettingFiles[i].path, (err, fileBuffer) => {
                if (!err) {
                  arrayOfNewFiles.push(createNewFile(fields, gettingFiles, fileBuffer, i));
                  if (i === (gettingFiles.length - 1)) resolve(arrayOfNewFiles);
                } else {
                  log.error(err.message);
                  reject(err);
                }
              });
            }
          }
        } else {
          log.error(err.message);
          reject(err);
        }
      };

      form.parse(req, getFileBuffer);
    });

    /**
     * Parse form-data from request.
     *
     * Content-type should be multipart/form-data.
     * File should be in "file" and will be taken only first
     * Name should be in "name" and will be taken only first or original filename
     *
     * @see https://github.com/pillarjs/multiparty
     * @param req {object} - express request obj
     */
    this.getParsedFormDataSingleFile = req => new Promise((resolve, reject) => {
      (new Form()).parse(req, (err, fields, files) => {
        //validation of parsed form-data
        //TODO add more validations
        if (err) return reject(err);
        if (!_.first(files.file)) return reject(new Error('File should be in "file" field'));

        let { originalFilename, path } = _.first(files.file);
        originalFilename = _.first(fields.name) || originalFilename;

        //TODO add hash to originalFilename
        const file = fs.createReadStream(path);

        return resolve({ file, originalFilename })
      });
    });

    /**
     * Parsing of request object
     * and getting files from fomData for portfolio photo
     *
     * @param req - express request object
     * @returns {Promise} - object
     */
    this.getPortfolioPhotoParsedFormData = req => new Promise((resolve, reject) => {
      const form = new Form();
      const checkName = (arrayOfFiles, fields, fieldName) => {
        return _.isEmpty(fields.name) ? _.first(_.get(`${fieldName}[${INDEX_OF_FILE}].originalFilename`, arrayOfFiles).split('.')) : _.first(fields.name);
      };

      const createNewFile = (fields, arrayOfFiles, fileBuffer, fieldName) => {
        const newFile = {
          [`name_${fieldName}`]: checkName(arrayOfFiles, fields, fieldName),
          [`${fieldName}_original_file_name`]: _.get(`${fieldName}[${INDEX_OF_FILE}].originalFilename`, arrayOfFiles),
          [`photo_${fieldName}`]: fileBuffer,
        };
        const newFields = {};
        for (const field in fields) {
          newFields[`${field}`] = _.first(fields[`${field}`]);
        }
        return Object.assign({}, newFields, newFile);
      };

      const getFileBuffer = (err, fields, files) => {
        console.log(fields);
        if (!err) {
          if (files.simple) {
            fs.readFile(_.first(files.simple).path, (err, fileBuffer) => {
              if (!err) {
                resolve(createNewFile(fields, files, fileBuffer, files.simple[INDEX_OF_FILE].fieldName));
              } else {
                log.error(err.message);
                reject(err);
              }
            });
          } else if (files.before && files.after) {
            const newObjectWithFiles = {};
            for (const fieldName in files) {
              fs.readFile(_.get(`${fieldName}[${INDEX_OF_FILE}].path`, files), (err, fileBuffer) => {
                if (!err) {
                  newObjectWithFiles[`${fieldName}`] = createNewFile(fields, files, fileBuffer, fieldName);
                  if (Object.keys(newObjectWithFiles).length === 2) {
                    resolve(Object.assign({}, newObjectWithFiles.before, newObjectWithFiles.after));
                  }
                } else {
                  log.error(err.message);
                  reject(err);
                }
              });
            }
          }
        } else {
          log.error(err.message);
          reject(err);
        }
      };

      form.parse(req, getFileBuffer);
    });

    /**
     * Parse custom "Geolocation" header
     * @param req
     * @return {Object|null}
     */
    this.parseGeolocationHeader = (req) => {
      if (_.isEmpty(req.header('Geolocation'))) return null;
      try {
        const geolocation = JSON.parse(req.header('Geolocation'));
        if (geolocation.lat && geolocation.lng) return geolocation;
        return null;
      } catch (e) {
        return null;
      }
    };

    this.emitProvidersVisits = (req, serviceName) => (providers) => {
      const location_coordinates = this.parseGeolocationHeader(req);
      const service = _.get('query.serviceName', req) || serviceName || null;
      const type = eventTypes.provider.PROVIDER_VISITED;

      if (Array.isArray(providers)) {
        providers.forEach(provider => eventBus.subject.next({
          type,
          payload: {
            location_coordinates,
            service,
            provider,
          },
        }))
      } else {
        eventBus.subject.next({
          type,
          payload: {
            location_coordinates,
            service,
            provider: providers,
          },
        });
      }

      return providers;
    }
  }
}

module.exports = new RouterUtils();
