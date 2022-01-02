const express = require('express');
const mongoose = require('mongoose');

const app = express();

//Connecting index.js with mongoDB database
mongoose.connect("mongodb://127.0.0.1/foodRanger", ()=>{
  console.log('Connected to mongoDB');
},
e=> console.error(e));
