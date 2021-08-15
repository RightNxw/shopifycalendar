const express = require("express");
const router = express.Router();
const Shoe = require("../models/main");
const path = require("path");

router.use("/", express.static("../frontend/"));

router.get("/shoesjson", async (req, res) => {
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
    url: req.body.url,
    price: req.body.price,
    date: req.body.date,
    image: req.body.image,
    stock: req.body.stock,
    sizeVars: req.body.sizeVars,
    vars: req.body.vars,
    MassVariants: req.body.MassVariants,
    stockList: req.body.stockList,
    time: req.body.time,
  });

  try {
    const a1 = await shoe.save();
    res.json(a1);
  } catch (err) {
    res.send("Error");
  }
});

router.post("/clear", async (req, res) => {
  try {
    if (req.body.clear === true) {
      Shoe.deleteMany({}, (err) => console.log(err));
      console.log("removing" + new Date().toUTCString());
      res.json({ cleared: true });
    }
  } catch (err) {
    console.log(err);
    res.json({ cleared: false });
  }
});

module.exports = router;
