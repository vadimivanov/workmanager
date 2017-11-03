const { describe, it, before } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization');
const inspirationCategoryController = require('../../controllers/inspiration-categories-controller');
const [first] = require('../../../config/database/seeds/InspirationCategory.seed.json');

const TEST_CATEGORY = Object.assign({},
  first, {
    name: Date.now() + first.name,
  }
);
const NEW_NAME = 'new name';

describe('Inspiration category controller', () => {
  let newCreatedCategory = null;

  before('Create new inspiration category', function (done) {
    this.timeout(5000);
    initialization.then(() => {
      inspirationCategoryController.createInspirationCategory(TEST_CATEGORY)
          .then((createdCategory) => {
            newCreatedCategory = createdCategory;
            expect(createdCategory.get('name')).to.equal(TEST_CATEGORY.name);
            done();
          })
          .catch((e) => {
            console.error(e.message);
            expect(e).to.not.exist;
          });
    });
  });

  it('Get single inspiration category by ID', (done) => {
    inspirationCategoryController.getInspirationCategoryById(newCreatedCategory.get('id'))
      .then((category) => {
        expect(category.get('name')).to.equal(TEST_CATEGORY.name);
        done();
      })
      .catch((e) => {
        console.error(e.message);
        expect(e).to.not.exist;
      });
  });

  it('Replace single inspiration category by itself', (done) => {
    inspirationCategoryController.updateInspirationCategory({ name: NEW_NAME }, newCreatedCategory.get('id'))
        .then((updatedCategory) => {
          expect(updatedCategory.get('name')).to.equal(NEW_NAME);
          done();
        })
        .catch((e) => {
          console.error(e.message);
          expect(e).to.not.exist;
        });
  });

  after('Delete inspiration category', (done) => {
    inspirationCategoryController.deleteInspirationCategoryById(newCreatedCategory.get('id'))
        .then(result => done())
        .catch((e) => {
          console.error(e.message);
          expect(e).to.not.exist;
        });
  });
});
