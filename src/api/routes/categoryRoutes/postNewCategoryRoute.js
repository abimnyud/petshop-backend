const postNewCategoryRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.postNewCategoryHandler; 

    const routerPath = '/categories/new';
    router.post(routerPath, handlerFn(diHash));

    return router;
}

module.exports = postNewCategoryRoute;