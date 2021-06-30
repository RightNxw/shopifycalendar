const express = require("express");
const router = express.Router();
const Shoe = require("../models/main");

router.get("/", async (req, res) => {
  try {
    const shoes = await Shoe.find();
    res.json(shoes);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/newmonthentries", async (req, res) => {
  const shoe = new Shoe({
    name: req.body.name,
    date: req.body.date,
    stock: req.body.stock,
  });

  try {
    const a1 = await shoe.save();
    res.json(a1);
  } catch (err) {
    res.send("Error");
  }
});

module.exports = router;
