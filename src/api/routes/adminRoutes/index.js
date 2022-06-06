const getAdminRoute = require('./getAdminRoute');
const getAdminListRoute = require('./getAdminListRoute');
const postNewAdminRoute = require('./postNewAdminRoute');
const putAdminRoute = require('./putAdminRoute');
const deleteAdminRoute = require('./deleteAdminRoute');

const adminRoutes = (diHash) => {
    const {
        express,
    } = diHash;

    const router = express.Router();

    router.use(getAdminListRoute(diHash));
    router.use(getAdminRoute(diHash));
    router.use(postNewAdminRoute(diHash));
    router.use(deleteAdminRoute(diHash));
    router.use(putAdminRoute(diHash));

    return router;
}

module.exports = adminRoutes;