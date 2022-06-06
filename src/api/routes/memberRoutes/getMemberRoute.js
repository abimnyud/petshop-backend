const getMemberRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getMemberHandler; 

    const routerPath = '/members/:id';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getMemberRoute;