const putAdminRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.putAdminHandler; 

    const routerPath = '/admins/:id/update';
    router.put(routerPath, handlerFn(diHash));

    return router;
}

module.exports = putAdminRoute;