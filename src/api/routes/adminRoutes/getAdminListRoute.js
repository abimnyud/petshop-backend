const getAdminListRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getAdminListHandler; 

    const routerPath = '/admins';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getAdminListRoute;