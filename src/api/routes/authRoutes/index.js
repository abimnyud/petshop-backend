const loginRoute = require('./loginRoute');

const authRoutes = (diHash) => {
    const {
        express,
    } = diHash;

    const router = express.Router();

    router.use(loginRoute(diHash));

    return router;
}

module.exports = authRoutes;