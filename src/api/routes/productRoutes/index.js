const getProductListRoute = require('./getProductListRoute');
const postNewProductRoute = require('./postNewProductRoute');
const getProductRoute = require('./getProductRoute');
const deleteProductRoute = require('./deleteProductRoute');
const putProductRoute = require('./putProductRoute');

const productRoutes = (diHash) => {
    const {
        express,
    } = diHash;

    const router = express.Router();

    router.use(getProductListRoute(diHash));
    router.use(postNewProductRoute(diHash));
    router.use(getProductRoute(diHash));
    router.use(deleteProductRoute(diHash));
    router.use(putProductRoute(diHash));

    return router;
}

module.exports = productRoutes;