const _ = require('lodash/fp');
const email = require('emailjs/email');
const jade = require('jade');
const path = require('path');

const { info_email } = require('../../config/email.config.json');

class EmailService {
  constructor() {
    /**
     * Function of send mail
     *
     * @param {String} mailForSend - email address
     * @param {Template} letterTemplate - jade template with variables
     * @param {Array} infoOfSentLetters - optional array of objects of sent letters
     * @param {String} theme - theme of letter
     * @returns {Promise} - array objects of sent letters
     */
    this.createMailSender = (mailForSend, letterTemplate, infoOfSentLetters, theme) => new Promise((resolve, reject) => {
      let countOfEmailSendingIteration = 0;
      if (_.isUndefined(theme)) theme = 'Okornok info';
      const emailServerConnection = email.server.connect({
        user: info_email.user,
        password: info_email.password,
        host: info_email.host,
        ssl: true,
      });

      function sending() {
        emailServerConnection.send({
          text: '',
          from: info_email.email,
          to: mailForSend,
          subject: theme,
          attachment:
          [
              { data: letterTemplate, alternative: true },
          ],
        }, (err, message) => {
          if (err) {
            if (countOfEmailSendingIteration < 5) {
              countOfEmailSendingIteration++;
              return setTimeout(sending, 5000);
            }
            return reject(err);
          }
          if (_.isUndefined(infoOfSentLetters)) return resolve(([message]));
          return resolve(infoOfSentLetters.concat([message]));
        });
      }
      sending();
    });

    this.getMergedJadeFile = (pathToFile, variables) => { return jade.renderFile(path.join(__dirname, pathToFile), variables) };

    this.encodeEmail = (emailToEncode) => { return new Buffer(emailToEncode).toString('base64') };

    this.decodeEmail = (emailToDecode) => { return new Buffer(emailToDecode, 'base64').toString() };
  }
}

module.exports = new EmailService();
