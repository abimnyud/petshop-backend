const postNewMemberRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.postNewMemberHandler; 

    const routerPath = '/members/new';
    router.post(routerPath, handlerFn(diHash));

    return router;
}

module.exports = postNewMemberRoute;