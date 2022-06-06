const getOrderListRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getOrderListHandler; 

    const routerPath = '/orders';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getOrderListRoute;