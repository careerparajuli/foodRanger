// Food Ranger ------- Algorizin's Project

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const md5 = require('md5');

//Importing files from models folder
const User = require('./models/User.js');
const Order = require('./models/Order.js');
const Review = require('./models/Review.js');
const Resturant = require('./models/Resturant.js');

const app = express();
//Using body parser to parse request
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Connecting node.js to mongoDB Atlas
// http://localhost:3000/resturants
mongoose.connect("mongodb+srv://parajuli:algorizin@cluster0.xymnw.mongodb.net/foodRanger", () => {
    console.log('Connected to mongoDB Atlas');
  },
  e => console.error(e));

/*
1) Registering a new user
*/
app.post("/auth/register", function(req, res) {
  const newUser = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: md5(req.body.password),
    phone: req.body.phone,
    address: req.body.address
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Successfully registered a user");
    }
  });
});

/*
2) Loggin registered user
*/
app.post("/auth/login", function(req, res) {
  const email = req.body.email;
  const password = md5(req.body.password);

  User.findOne({
    email: email
  }, function(err, foundUser) {
    if (err) {
      res.send(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.send("Login Successful");
        }
      }
    }
  });
});

/*
---Getting all users informations
*/
app.route("/users")
  .get(function(req, res) {
    User.find(function(err, foundUsers) {
      res.send(foundUsers);
    });
  });

/*
3) Getting specific user information
*/
app.route("/users/:id")
  .get(function(req, res) {
    User.findOne({
      id: req.params.id
    }, function(err, foundUser) {
      if (foundUser) res.send(foundUser);
      else res.send(err + "No matching article");
    });
  })

/*
---Getting all resturants on database
*/
app.route("/resturants")
  .get(function(req, res) {
    Resturant.find(function(err, foundResturants) {
      res.send(foundResturants);
    });
  })

  /*
  4) Creating a new restutant
  */
  .post(function(req, res) {
    const newResturant = new Resturant({
      name: req.body.name,
      location: req.body.location,
      menu: req.body.menu
    });
    newResturant.save();
  })

  /*
  5) Updating a resturant
  */
  .patch(function(req, res) {
    Resturant.updateOne({
        _id: req.params.id
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

  /*
 ---Deleting all resturant
  */
  .delete(function(req, res) {
    Resturant.deleteMany(function(err) {
      if (err) console.log("Successfully deleted all articles");
      else console.log(err);
    });
  })

  /*
6) Deleting a resturant
  */
  .delete(function(req, res) {
    Resturant.deleteOne({
        _id: req.params.id
      },
      function(err) {
        if (err) console.log("Successfully deleted a articles");
        else console.log(err);
      });
  })

  /*
  7) Getting a resturant info
  */
  .get(function(req, res) {
    Resturant.findOne({
      _id: req.params.id
    }, function(err, foundResturant) {
      if (foundResturant) res.send(foundResturant);
      else res.send(err + "No matching article");
    });
  });

/*
8) Listing all orders of a resturant
*/
app.get('resturants/:id/orders', async (req, res) => {
  try {
    const orders = await Order
      .find({
        "restaurant_id": req.params.id
      })
      .populate("user_id")
      .populate("restaurant_id");
    res.json({
      message: orders
    });
  } catch (err) {
    res.json({
      message: err
    });
  }
});

/*
9) Placing an order to the resturant
*/
app.post('resturants/:id/orders', async (req, res) => {
  const order = new Order({
    restaurant_id: req.params.id,
    user_id: req.body.user_id,
    items: req.body.items,
    subtotal: req.body.subtotal
  });
  const savedOrder = await order.save();
  res.json({
    message: savedOrder
  });
});

/*
10) Listing orders placed by a specific users on a resturant
*/
app.get('resturants/:id/orders/:userId', async (req, res) => {
  try {
    const orders = await Order
      .find({
        "restaurant_id": req.params.id,
        "user_id": req.params.userId
      })
      .populate("user_id")
      .populate("restaurant_id");
    res.json({
      message: orders
    });
  } catch (err) {
    res.json({
      message: err
    });
  }
});

/*
11) Listing orders placed by a user on any resturant
*/
app.get('users/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review
      .find({
        "user_id": req.params.id
      })
      .populate("user_id")
      .populate("restaurant_id");
    res.json({
      message: reviews
    });
  } catch (err) {
    res.json({
      message: err
    });
  }
});

/*
12) Posting a review
*/
app.post('resturants/:id/reviews', async (req, res) => {
  try {
    const review = new Review({
      user_id: req.body.user_id,
      restaurant_id: req.params.id,
      content: req.body.content,
      rating: req.body.rating
    });
    const savedReview = await review.save();
    res.json({
      message: savedReview
    });
  } catch (err) {
    res.json({
      message: err
    })
  }
});
/*
13) Listing resturant review
*/
app.get('resturants/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review
      .find({
        "restaurant_id": req.params.id
      })
      .populate("user_id")
      .populate("restaurant_id");
    res.json({
      message: reviews
    });
  } catch (err) {
    res.json({
      messsage: err
    });
  }
});

/*
14) Deleting a review
*/
app.delete('/:id/reviews/:reviewId', async (req, res) => {
  try {
    const review = await Review.remove({
      "_id": req.params.reviewId
    });
    res.json({
      message: reviews
    });
  } catch (err) {
    res.json({
      message: err
    });
  }
});

//Listening on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
