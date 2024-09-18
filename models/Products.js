const { default: mongoose } = require("mongoose");

const produtSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    details: {
        type: String
    },
    imgLink: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Products', produtSchema)