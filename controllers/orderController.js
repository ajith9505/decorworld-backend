
const asyncHandler = require('express-async-handler');
const Orders = require('../models/Order');

const getOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const orders = await Orders.find({ userId: userId });
    if (orders.length <= 0) res.json({ msg: 'Oreder not found' })
    res.send(orders);
})  

module.exports = {
    getOrders
}