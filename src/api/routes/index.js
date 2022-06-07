const orderRoutes = require('./orderRoutes');
const productRoutes = require('./productRoutes');
const memberRoutes = require('./memberRoutes');
const paymentRoutes = require('./paymentRoutes'); 
const adminRoutes = require('./adminRoutes');
const categoryRoutes = require('./categoryRoutes');
const authRoutes = require('./authRoutes');

const routes = (diHash) => {
    const {
        express,
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

const authenticateRoutes = (diHash) => {
    const {
        express,
    } = diHash;

    const authRouter = express.Router();

    authRouter.use(authRoutes(diHash));

    return authRouter;
}

module.exports = {
    routes,
    authenticateRoutes
};