const deleteCategoryRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.deleteCategoryHandler; 

    const routerPath = '/categories/:id/delete';
    router.delete(routerPath, handlerFn(diHash));

    return router;
}

module.exports = deleteCategoryRoute;