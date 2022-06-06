const getOrderListRoute = require('./getOrderListRoute');
const getOrderRoute = require('./getOrderRoutes');
const postNewOrderRoute = require('./postNewOrderRoute');
const deleteOrderRoute = require('./deleteOrderRoute');

const orderRoutes = (diHash) => {
    const {
        express,
    } = diHash;

    const router = express.Router();

    router.use(getOrderListRoute(diHash));
    router.use(getOrderRoute(diHash));
    router.use(postNewOrderRoute(diHash));
    router.use(deleteOrderRoute(diHash));

    return router;
}

module.exports = orderRoutes;