const getAdminRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.getAdminHandler; 

    const routerPath = '/admins/:id';
    router.get(routerPath, handlerFn(diHash));

    return router;
}

module.exports = getAdminRoute;