const getPaymentListRoute = require('./getPaymentListRoute');
const getPaymentRoute = require('./getPaymentRoute');
const postNewPaymentRoute = require('./postNewPaymentRoute');

const paymentRoutes = (diHash) => {
    const {
        express,
    } = diHash;

    const router = express.Router();

    router.use(getPaymentListRoute(diHash));
    router.use(getPaymentRoute(diHash));
    router.use(postNewPaymentRoute(diHash));

    return router;
}

module.exports = paymentRoutes;