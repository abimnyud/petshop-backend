const deleteProductRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.deleteProductHandler; 

    const routerPath = '/products/:id/delete';
    router.delete(routerPath, handlerFn(diHash));

    return router;
}

module.exports = deleteProductRoute;