const getPaymentListRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getPaymentListHandler; 

    const routerPath = '/payments';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getPaymentListRoute;