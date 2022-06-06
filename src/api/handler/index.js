const productHandler = require('./productHandler');
const orderHandler = require('./orderHandler');
const memberHandler = require('./memberHandler');
const paymentHandler = require('./paymentHandler');
const adminHandler = require('./adminHandler');
const categoryHandler = require('./categoryHandler');

const handlerList = [
    productHandler,
    orderHandler,
    memberHandler,
    paymentHandler,
    adminHandler,
    categoryHandler
]

const handlerHash = {};

handlerList.forEach((handler) => {
    Object.assign(handlerHash, handler);
})

module.exports = handlerHash;