const getOrderRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getOrderHandler; 

    const routerPath = '/orders/:id';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getOrderRoute;