const getMemberOrderHistoryRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getMemberOrderHistoryHandler; 

    const routerPath = '/members/:id/orders';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getMemberOrderHistoryRoute;