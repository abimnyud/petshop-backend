const orderRoutes = require('./orderRoutes');
const productRoutes = require('./productRoutes');
const memberRoutes = require('./memberRoutes');
const paymentRoutes = require('./paymentRoutes'); 
const adminRoutes = require('./adminRoutes');
const categoryRoutes = require('./categoryRoutes');

const routes = (diHash) => {
    const {
        express
    } = diHash;

    const router = express.Router();

    router.use(orderRoutes(diHash));
    router.use(productRoutes(diHash));
    router.use(memberRoutes(diHash));
    router.use(paymentRoutes(diHash));
    router.use(adminRoutes(diHash));
    router.use(categoryRoutes(diHash));

    return router;
}

module.exports = routes;