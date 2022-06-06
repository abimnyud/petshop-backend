const getAdminHandler = require('./getAdminHandler');
const getAdminListHandler = require('./getAdminListHandler');
const postNewAdminHandler = require('./postNewAdminHandler');
const deleteAdminHandler = require('./deleteAdminHandler');
const putAdminHandler = require('./putAdminHandler');

const adminHandler = {
    getAdminHandler,
    getAdminListHandler,
    postNewAdminHandler,
    deleteAdminHandler,
    putAdminHandler
}

module.exports = adminHandler;