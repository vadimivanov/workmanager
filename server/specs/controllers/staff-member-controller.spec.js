const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization');
const staffMemberController = require('../../controllers/staff-member-controller');
const [firstWorker] = require('../../../config/database/seeds/StaffMember.seed.json');
const [first] = require('../../../config/database/seeds/Providers.seed.json');

const TEST_FILE_1 = 'https://okornok-uploads.s3.eu-central-1.amazonaws.com/test-user-1.jpg';
const TEST_FILE_2 = 'https://okornok-uploads.s3.eu-central-1.amazonaws.com/test-user-2.jpg';

const TEST_STAFF_MEMBER_1 = Object.assign({},
  firstWorker, {
    name: Date.now() + firstWorker.name,
    photo_url: TEST_FILE_1,
  });

delete TEST_STAFF_MEMBER_1.id;
delete TEST_STAFF_MEMBER_1.provider_id;

const TEST_STAFF_MEMBER_2 = Object.assign({},
  TEST_STAFF_MEMBER_1, {
    name: Date.now() + firstWorker.name,
    photo_url: TEST_FILE_2,
  });

describe('Staff member controller', () => {
  let newCreatedStaffMember = null;

  before('Create new staff member', (done) => {
    initialization.then(() => {
      staffMemberController.createStaffMember(TEST_STAFF_MEMBER_1, first)
        .then((createdStaffMember) => {
          newCreatedStaffMember = createdStaffMember;
          expect(createdStaffMember.provider_id).to.be.equal(first.id);
          expect(createdStaffMember.photo_url).to.be.eql(TEST_FILE_1);
          done();
        })
    })
      .catch((e) => {
        console.error(e.message);
        expect(e).to.not.exist;
      });
  });

  it('Get staff member by id', (done) => {
    staffMemberController.getStaffMemberById(newCreatedStaffMember.get('id'))
      .then((staffMember) => {
        expect(staffMember.description).to.be.equal(TEST_STAFF_MEMBER_1.description);
        done();
      })
      .catch((e) => {
        console.error(e.message);
        expect(e).to.not.exist;
      });
  });

  it('Get staf members by provider id', (done) => {
    staffMemberController.getAllStaffMembersByProvider(first)
      .then((staffMember) => {
        for (let i = 0; i < staffMember.length; i++) {
          if (staffMember[i].id === newCreatedStaffMember.id) {
            expect(staffMember[i].description).to.be.equal(TEST_STAFF_MEMBER_1.description);
            done();
          }
        }
      })
      .catch((e) => {
        console.log(e.message);
        expect(e).to.not.exist;
      });
  });

  it('Replace one staff member on another, with new photo', (done) => {
    staffMemberController.updateStaffMemberByIdAndProvider(TEST_STAFF_MEMBER_2, newCreatedStaffMember.get('id'), first)
      .then((updatedStaffMember) => {
        expect(updatedStaffMember.name).to.be.equal(TEST_STAFF_MEMBER_2.name);
        expect(updatedStaffMember.photo_url).to.be.eql(TEST_FILE_2);
        done();
      })
      .catch((e) => {
        console.log(e.message);
        expect(e).to.not.exist;
      });
  });

  it('Replace staff member, without new photo', (done) => {
    delete TEST_STAFF_MEMBER_1.photo_url;
    staffMemberController.updateStaffMemberByIdAndProvider(TEST_STAFF_MEMBER_1, newCreatedStaffMember.get('id'), first)
      .then((updatedStaffMember) => {
        expect(updatedStaffMember.name).to.be.equal(TEST_STAFF_MEMBER_1.name);
        expect(updatedStaffMember.photo_url).to.be.eql(TEST_FILE_2);
        done();
      })
      .catch((e) => {
        console.log(e.message);
        expect(e).to.not.exist;
      });
  });

  after('Delete staff member', (done) => {
    staffMemberController.deleteStaffMemberByIdAndProvider(newCreatedStaffMember.get('id'), first)
      .then(() => done())
      .catch((e) => {
        console.log(e.message);
        expect(e).to.not.exist;
      });
  });
});
