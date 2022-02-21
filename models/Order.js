const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    restaurant_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Restaurant"
    },
    items: [String],
    subtotal : Number,
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    date : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order",orderSchema);
