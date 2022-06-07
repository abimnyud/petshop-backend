const validation = require('./validation');
const verifyAPIKey = require('./verifyAPIKey');

const middlewareHash = {
    validation,
    verifyAPIKey
}

module.exports = middlewareHash;