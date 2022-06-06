const getCategoryHandler = require('./getCategoryHandler.js');
const getCategoryListHandler = require('./getCategoryListHandler');
const postNewCategoryHandler = require('./postNewCategoryHandler');
const deleteCategoryHandler = require('./deleteCategoryHandler');
const putCategoryHandler = require('./putCategoryHandler');

const categoryHandler = {
    getCategoryHandler,
    getCategoryListHandler,
    postNewCategoryHandler,
    deleteCategoryHandler,
    putCategoryHandler
};

module.exports = categoryHandler;