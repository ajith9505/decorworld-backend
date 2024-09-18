const { default: mongoose } = require("mongoose");

const orderSchema = mongoose.Schema({
    qty:{
        type: Numaber,
        required: true
    }
})