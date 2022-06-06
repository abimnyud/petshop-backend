const deleteAdminRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.deleteAdminHandler; 

    const routerPath = '/admins/:id/delete';
    router.delete(routerPath, handlerFn(diHash));

    return router;
}

module.exports = deleteAdminRoute;