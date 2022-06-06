const productHandler = require('./productHandler');
const orderHandler = require('./orderHandler');

const handlerList = [
    productHandler,
    orderHandler,
]

const handlerHash = {};

handlerList.forEach((handler) => {
    Object.assign(handlerHash, handler);
})

module.exports = handlerHash;