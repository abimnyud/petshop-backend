const getOrderListHandler = require('./getOrderListHandler');
const getOrderHandler = require('./getOrderHandler');
const postNewOrderHandler = require('./postNewOrderHandler');
const deleteOrderHandler = require('./deleteOrderHandler');

const orderHandler = {
    getOrderListHandler,
    getOrderHandler,
    postNewOrderHandler,
    deleteOrderHandler
}

module.exports = orderHandler;