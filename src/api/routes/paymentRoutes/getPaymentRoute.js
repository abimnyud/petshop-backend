const getPaymentRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getPaymentHandler; 

    const routerPath = '/payments/:id';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getPaymentRoute;