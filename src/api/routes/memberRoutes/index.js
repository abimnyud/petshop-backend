const getMemberListRoute = require('./getMemberListRoute');
const getMemberRoute = require('./getMemberRoute');
const getMemberOrderHistoryRoute = require('./getMemberOrderHistoryRoute');
const postNewMemberRoute = require('./postNewMemberRoute');
const deleteMemberRoute = require('./deleteMemberRoute');

const memberRoutes = (diHash) => {
    const {
        express,
    } = diHash;

    const router = express.Router();

    router.use(getMemberListRoute(diHash));
    router.use(getMemberRoute(diHash));
    router.use(getMemberOrderHistoryRoute(diHash));
    router.use(postNewMemberRoute(diHash));
    router.use(deleteMemberRoute(diHash));

    return router;
}

module.exports = memberRoutes;