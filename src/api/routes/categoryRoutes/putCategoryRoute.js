const putCategoryRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.putCategoryHandler; 

    const routerPath = '/categories/:id/update';
    router.put(routerPath, handlerFn(diHash));

    return router;
}

module.exports = putCategoryRoute;