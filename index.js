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
// http://localhost:3000/resturants
mongoose.connect("mongodb+srv://parajuli:algorizin@cluster0.xymnw.mongodb.net/foodRanger", () => {
    console.log('Connected to mongoDB Atals');
  },
  e => console.error(e));

//Creating userSchema to save username and password to mongoDB Atlas
const userSchema = {
  email: String,
  password: String
}

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("Login");
});
app.get("/register", function(req, res) {
  res.render("Register");
});


//To target the register app
app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Successfully registered a user");
    }
  });
});

//TO Login
app.post("/login", function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}, function(err, foundUser) {
    if (err) {
      res.send(err+ "Login Failed" );
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.send("Login Successful");
        }
      }
    }
  });
});

///////////////////////////////////////////////////////
//Creating new foodSchema
const foodSchema = {
  name: String,
  location: String,
  rating: String,
  foodMenu: Array,
  reviews: Array
};

//Creating model
const Food = mongoose.model("Food", foodSchema);

///////////////////////////Request targeting all data ////////////////////

//localhost:3000/resturants
app.route("/resturants")
  .get(function(req, res) {
    Food.find(function(err, foundFoods) {
      res.send(foundFoods);
    });
  })

  //To create new resturant
  //Using post man to creat a resturant
  //localhost:3000/resturants
  .post(function(req, res) {
    const newFood = new Food({
      name: req.body.name,
      location: req.body.location,
      rating: req.body.rating,
      foodMenu: req.body.foodMenu,
      reviews: req.body.reviews
    });
    newFood.save();
  })

  //To delete all the resturants
  //Using postman to delete a resturant
  //localhost:3000/resturants
  .delete(function(req, res) {
    Food.deleteMany(function(err) {
      if (err) console.log("Successfully deleted all articles");
      else console.log(err);
    });
  });

//////////////////////////Request specific data ///////////////////////////////

//localhost:3000/Papa%20Jones
app.route("/resturants/:id")
  .get(function(req, res) {
    Food.findOne({
      name: req.params.id
    }, function(err, foundResturant) {
      if (foundResturant) res.send(foundResturant);
      else res.send(err + "No matching article");
    });
  })

  // Updating a specific resturant
  // Updating specific field of the resturant unlike "PUT"

  //////////////////////////////////////CODE is not working ////////////////////////
  .patch(function(req, res) {
    Food.updateOne({
        title: req.params.id
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated");
        } else {
          res.send("Update failed");
        }
      });
  })


  //Deleting a specific resturant
  //localhost:3000/resturant/American%20Resturant
  .delete(function(req, res) {
    Food.deleteOne({
        name: req.params.id
      },
      function(err) {
        if (err) console.log("Successfully deleted a articles");
        else console.log(err);
      });
  });

//Listening on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
