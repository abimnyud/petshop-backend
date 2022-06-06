const getProductListRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getProductListHandler; 

    const routerPath = '/products';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getProductListRoute;