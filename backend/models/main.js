const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  stock: {
    type: Number,
    required: false,
  },
  sizeVars: {
    type: Array,
    required: false,
  },
  vars: {
    type: Array,
    required: false,
  },
  stockList: {
    type: Array,
    require: false,
  },
  time: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model("Shoe", shoeSchema);
