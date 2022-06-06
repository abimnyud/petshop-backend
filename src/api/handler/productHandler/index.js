const getProductListHandler = require('./getProductListHandler');
const postNewProductHandler = require('./postNewProductHandler');
const getProductHandler = require('./getProductHandler');
const deleteProductHandler = require('./deleteProductHandler');
const postUpdateProductHandler = require('./postUpdateProductHandler');

const productHandler = {
    getProductListHandler,
    getProductHandler,
    postNewProductHandler,
    deleteProductHandler,
    postUpdateProductHandler
}

module.exports = productHandler;