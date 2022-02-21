const mongoose = require('mongoose');

const resturantSchema = {
  name:{
        type: String,
        required: true,
        min:6,
        max:255
    },
  location: {
        type: String,
        required: true,
        min:6,
        max:255
    },
  menu: Object
};

//Creating model
module.exports = mongoose.model("Resturant", resturantSchema);
