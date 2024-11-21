const { default: mongoose } = require("mongoose");
const { ObjectId } = mongoose.Schema;

const produtSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
},
    { timestamps: true })

module.exports = mongoose.model('Products', produtSchema)