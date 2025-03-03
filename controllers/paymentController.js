const Razorpay = require('razorpay');
const expressAsyncHandler = require("express-async-handler");
const crypto = require('crypto');
const Order = require('../models/Order')


const orderPayment = expressAsyncHandler(async(req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = req.body
        const order = await instance.orders.create(options)
        
        if(!order) return res.status(500).send("Some error occured");
        
        res.json(order)
    } catch (error) {
        res.status(500).send(error);
    }
});

const validateOrder = expressAsyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products } = req.body;

  try {
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  products.forEach(ele => {
    const order = new Order({
      userId: req.user.id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      productId: ele.id,
      productName: ele.productName,
      img: ele.img,
      price: ele.price,
      qty: ele.qty
    });
  
    order.save();
  });

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
  } catch (err) {
    res.json(err)
  }
});

module.exports = {
    orderPayment,
    validateOrder
};