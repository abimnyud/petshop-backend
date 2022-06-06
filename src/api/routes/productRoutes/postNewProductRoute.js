const postNewProductRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.postNewProductHandler; 

    const routerPath = '/products/new';
    router.post(routerPath, handlerFn(diHash));

    return router;
}

module.exports = postNewProductRoute;