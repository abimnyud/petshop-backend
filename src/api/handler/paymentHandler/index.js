const getPaymentHandler = require('./getPaymentHandler');
const getPaymentListHandler = require('./getPaymentListHandler');
const postNewPaymentHandler = require('./postNewPaymentHandler');

const paymentHandler = {
    getPaymentHandler,
    getPaymentListHandler,
    postNewPaymentHandler
};

module.exports = paymentHandler;