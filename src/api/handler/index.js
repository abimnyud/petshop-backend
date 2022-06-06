const productHandler = require('./productHandler');
const orderHandler = require('./orderHandler');
const memberHandler = require('./memberHandler');
const paymentHandler = require('./paymentHandler');

const handlerList = [
    productHandler,
    orderHandler,
    memberHandler,
    paymentHandler
]

const handlerHash = {};

handlerList.forEach((handler) => {
    Object.assign(handlerHash, handler);
})

module.exports = handlerHash;