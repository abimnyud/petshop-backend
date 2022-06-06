const postNewAdminRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.postNewAdminHandler; 

    const routerPath = '/admins/new';
    router.post(routerPath, handlerFn(diHash));

    return router;
}

module.exports = postNewAdminRoute;