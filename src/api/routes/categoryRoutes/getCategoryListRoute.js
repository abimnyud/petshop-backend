const getCategoryListRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getCategoryListHandler; 

    const routerPath = '/categories';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getCategoryListRoute;