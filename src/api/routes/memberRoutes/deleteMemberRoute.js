const deleteMemberRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.deleteMemberHandler; 

    const routerPath = '/members/:id/delete';
    router.delete(routerPath, handlerFn(diHash));

    return router;
}

module.exports = deleteMemberRoute;