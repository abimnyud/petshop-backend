const getCategoryRoute = require('./getCategoryRoute');
const getCategoryListRoute = require('./getCategoryListRoute');
const postNewCategoryRoute = require('./postNewCategoryRoute');
const putCategoryRoute = require('./putCategoryRoute');
const deleteCategoryRoute = require('./deleteCategoryRoute');

const categoryRoutes = (diHash) => {
    const {
        express,
    } = diHash;

    const router = express.Router();

    router.use(getCategoryRoute(diHash));
    router.use(getCategoryListRoute(diHash));
    router.use(postNewCategoryRoute(diHash));
    router.use(deleteCategoryRoute(diHash));
    router.use(putCategoryRoute(diHash));

    return router;
}

module.exports = categoryRoutes;