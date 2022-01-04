const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

//Using body parser in order to parse request
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Connecting node.js to mongodb
// http://localhost:3000/articles
mongoose.connect("mongodb://127.0.0.1/foodRanger", ()=>{
  console.log('Connected to mongoDB');
},
e=> console.error(e));

//Creating new schema
const foodSchema = {
  name: String,
  location: String,
  rating: String,
  foodMenu: Array
};

//Creating model
const Food = mongoose.model("Food", foodSchema);

///////////////////////////Request targeting all data ////////////////////

//localhost:3000/resturant
app.route("/resturants")
.get(function(req, res){
  Food.find(function(err, foundFoods){
    res.send(foundFoods);
  });
})

.post(function(req, res){
  const newFood = new Food({
    name: req.body.name,
    location: req.body.location,
    rating: req.body.rating,
    foodMenu: req.body.foodMenu
  });
  newFood.save();
});

//////////////////////////Request specific data ///////////////////////////////

//localhost:3000/Papa%20Jones
app.route("/resturants/:id")
.get(function(req, res){
  Food.findOne({name:req.params.id}, function(err, foundResturant){
    if(foundResturant) res.send(foundResturant);
    else res.send(err +"No matching article");
  });
});

//Listening on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
