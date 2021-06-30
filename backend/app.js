const express = require("express");
const mongoose = require("mongoose");
const url = "";

const app = express();

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("connected...");
});

app.use(express.json());

const shoeRouter = require("./routes/shoes");
app.use("/", shoeRouter);

app.listen(9000, () => {
  console.log("Server started");
});
