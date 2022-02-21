const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
     user_id : {
         type : mongoose.Schema.Types.ObjectId,
         ref : "User"
     },
     restaurant_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Restaurant"
    },
     content : {
       type: String,
       require: true
     },
     // For Rating
     rating:[{
         food : Number,
         service : Number,
         environment : Number,
         price : Number,
     }]
 });

module.exports = mongoose.model("Review",reviewSchema);
