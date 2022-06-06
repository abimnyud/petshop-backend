const deleteOrderRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.deleteOrderHandler; 

    const routerPath = '/orders/:id/cancel';
    router.delete(routerPath, handlerFn(diHash));

    return router;
}

module.exports = deleteOrderRoute;