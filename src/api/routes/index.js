const orderRoutes = require('./orderRoutes');
const productRoutes = require('./productRoutes');

const routes = (diHash) => {
    const {
        express
    } = diHash;

    const router = express.Router();

    router.use(orderRoutes(diHash));
    router.use(productRoutes(diHash));

    return router;
}

module.exports = routes;