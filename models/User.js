const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    require: true
  },
  lname: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    min: 6,
    max:255
  },
  password: {
    type: String,
    require: true,
    min:8,
    max:255
  },
  phone: String,
  address: String
});

module.export = mongoose.model("User", userSchema);
