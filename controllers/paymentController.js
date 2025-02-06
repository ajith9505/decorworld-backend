const Razorpay = require('razorpay');

const orderPayment = async() => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: 50000,
            currency: 'INR',
            receipt: 'receipt#1'
        }
        const order = await instance.orders.create(options)
        
        if(!order) return res.status(500).send("Some error occured");

        res.json(order)
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = orderPayment;