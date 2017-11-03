const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization');
const documentController = require('../../controllers/document-controller');
const [firstDocument] = require('../../../config/database/seeds/Documents.seed.json');
const [first] = require('../../../config/database/seeds/Providers.seed.json');

const TEST_FILE_1 = 'https://okornok-uploads.s3.eu-central-1.amazonaws.com/test-document-2.jpg';

const TEST_DOCUMENT = Object.assign({},
  firstDocument, {
    name: Date.now() + firstDocument.name,
  }
);

delete TEST_DOCUMENT.id;

describe('Document controller', () => {
  let createdDocument = null;

  before('Create new document', async () => {
    try {
      await initialization;
      createdDocument = await documentController.createDocument(TEST_DOCUMENT, first);
      expect(createdDocument.get('name')).to.equal(TEST_DOCUMENT.name);
      expect(createdDocument.get('file_url')).to.equal(TEST_DOCUMENT.file_url);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Get single document by ID', async () => {
    try {
      const singleDocument = await documentController.getDocumentById(createdDocument.get('id'));
      expect(singleDocument.get('name')).to.equal(TEST_DOCUMENT.name);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Get single document by provider', async () => {
    try {
      const documents = await documentController.getDocumentsByProvider(first);
      expect(documents).to.be.instanceof(Array);
      for (let i = 0; i < documents.length; i++) {
        if (documents[i].get('id') === createdDocument.get('id')) {
          expect(documents[i].get('name')).to.equal(TEST_DOCUMENT.name);
        }
      }
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Replace single document by itself', async () => {
    try {
      const updatedDocument = await documentController.replaceDocument({ file_url: TEST_FILE_1 }, createdDocument.get('id'));
      expect(updatedDocument.get('name')).to.equal(TEST_DOCUMENT.name);
      expect(updatedDocument.get('file_url')).to.equal(TEST_FILE_1);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  after('Delete document', async () => {
    try {
      await documentController.deleteDocument(createdDocument.get('id'));
    } catch (e) {
      console.log(e.message);
      expect(e).to.not.exist;
    }
  });
});
