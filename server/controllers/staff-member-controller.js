const EventEmitter = require('events');
const _ = require('lodash/fp');

const { StaffMember, Provider } = require('../models');
const { sanitizeSubject } = require('./controller-utils');

class StaffMemberController extends EventEmitter {
  constructor() {
    super();

    this.createStaffMember = (newStaffMember, { id }) => StaffMember.create(
      Object.assign({},
        sanitizeSubject(newStaffMember),
        { provider_id: id }));

    this.getAllStaffMembersByProvider = ({ id }, offset, limit) => StaffMember.findAll({
      where: { provider_id: id },
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    this.getStaffMemberById = id => StaffMember.findOne({
      where: { id },
    });

    this.updateStaffMemberById = (newStaffMember, id) => {
      return StaffMember.update(
        sanitizeSubject(newStaffMember), {
          where: { id },
          returning: true,
          plain: true,
        })
        .then(_.last);
    };

    this.updateStaffMemberByIdAndProvider = (newStaffMember, staffMemberId, { id }) => {
      return StaffMember.update(
        sanitizeSubject(newStaffMember), {
          where: { id: staffMemberId, provider_id: id },
          returning: true,
          plain: true,
        })
        .then(_.last);
    };

    this.deleteStaffMemberById = id => StaffMember.destroy({
      where: { id },
    });

    this.deleteStaffMemberByIdAndProvider = (staffMemberId, { id }) => StaffMember.destroy({
      where: { id: staffMemberId, provider_id: id },
    })
  }
}

module.exports = new StaffMemberController();
