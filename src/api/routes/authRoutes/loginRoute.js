const loginRoute = (diHash) => {
    const {
        express,
        handlerHash,
    } = diHash;

    const router = express.Router();
    const handlerFn = handlerHash.loginHandler; 

    const routerPath = '/login';
    router.post(routerPath, handlerFn(diHash));

    return router;
}

module.exports = loginRoute;