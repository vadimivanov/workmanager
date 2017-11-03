const { StaffMember, Document, InspirationCategory, FeedbackRequest, Subservice, Service, Location } = require('../../server/models');

module.exports = [StaffMember, Document, FeedbackRequest, Location,
    { model: Subservice,
        through: 'ProviderSubservice',
        include: [Service], },
];