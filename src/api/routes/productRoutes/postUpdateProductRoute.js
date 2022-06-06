const postUpdateProductRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.postUpdateProductHandler; 

    const routerPath = '/products/:id/update';
    router.post(routerPath, handlerFn(diHash));

    return router;
}

module.exports = postUpdateProductRoute;