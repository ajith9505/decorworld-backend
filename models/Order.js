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
    products: {
        type: Array,
        required: true
    }
},
    { timestams: true }
)

module.exports = mongoose.model('Order', orderSchema)