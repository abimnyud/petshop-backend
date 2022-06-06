const getProductListHandler = require('./getProductListHandler');
const postNewProductHandler = require('./postNewProductHandler');
const getProductHandler = require('./getProductHandler');
const deleteProductHandler = require('./deleteProductHandler');
const putProductHandler = require('./putProductHandler');

const productHandler = {
    getProductListHandler,
    getProductHandler,
    postNewProductHandler,
    deleteProductHandler,
    putProductHandler
}

module.exports = productHandler;