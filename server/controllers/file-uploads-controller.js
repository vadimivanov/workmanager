const EventEmitter = require('events');

const s3Config = require('../../config/database/s3.config.json');
const s3 = require('../initialization/s3.initialization');

class FileUploadsController extends EventEmitter {
  constructor() {
    super();

    /**
     * Save image to file storage
     * @param file
     * @param originalFilename
     * @return {Promise}
     */
    this.saveImage = ({ file, originalFilename }) => {
      const params = {
        Key: originalFilename,
        Body: file,
        Bucket: s3Config.Bucket.name,
        //TODO think about ContentType according to image type
        ACL: s3Config.imagesACL,
      };

      return new Promise((resolve, reject) => {
        s3.upload(params, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        })
      })
    }

    /**
     * Save file to file storage
     * @param file
     * @param originalFilename
     * @return {Promise}
     */
    this.saveFile = ({ file, originalFilename }) => {
      const params = {
        Key: originalFilename,
        Body: file,
        Bucket: s3Config.Bucket.name,
        ACL: s3Config.imagesACL,
      };

      return new Promise((resolve, reject) => {
        s3.upload(params, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        })
      })
    }
  }
}

module.exports = new FileUploadsController();
