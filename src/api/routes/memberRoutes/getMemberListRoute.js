const getMemberListRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getMemberListHandler; 

    const routerPath = '/members';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getMemberListRoute;