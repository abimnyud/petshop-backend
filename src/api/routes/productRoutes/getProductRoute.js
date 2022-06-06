const getProductRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getProductHandler; 

    const routerPath = '/products/:id';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getProductRoute;