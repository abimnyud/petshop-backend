const postNewPaymentRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.postNewPaymentHandler; 

    const routerPath = '/payments/pay';
    router.post(routerPath, handlerFn(diHash));

    return router;
}

module.exports = postNewPaymentRoute;