const { default: mongoose } = require("mongoose");

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true  
    },
    price: {
        type: Number,
        required: true
    },
    qty:{
        type: Number,
        require: true
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)