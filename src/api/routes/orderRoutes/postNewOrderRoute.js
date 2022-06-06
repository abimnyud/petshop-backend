const postNewOrderRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.postNewOrderHandler; 

    const routerPath = '/orders/new';
    router.post(routerPath, handlerFn(diHash));

    return router;
}

module.exports = postNewOrderRoute;