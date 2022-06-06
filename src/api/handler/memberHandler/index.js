const getMemberListHandler = require('./getMemberListHandler');
const getMemberHandler = require('./getMemberHandler');
const getMemberOrderHistoryHandler = require('./getMemberOrderHistory');
const postNewMemberHandler = require('./postNewMemberHandler');
const deleteMemberHandler = require('./deleteMemberHandler');

const memberHandler = {
    getMemberListHandler,
    getMemberHandler,
    getMemberOrderHistoryHandler,
    postNewMemberHandler,
    deleteMemberHandler
}

module.exports = memberHandler;