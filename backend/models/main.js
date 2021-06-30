const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Shoe", shoeSchema);
