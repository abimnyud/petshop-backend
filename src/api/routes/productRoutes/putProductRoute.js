const putProductRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.putProductHandler; 

    const routerPath = '/products/:id/update';
    router.put(routerPath, handlerFn(diHash));

    return router;
}

module.exports = putProductRoute;