const getCategoryRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getCategoryHandler; 

    const routerPath = '/categories/:id';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getCategoryRoute;