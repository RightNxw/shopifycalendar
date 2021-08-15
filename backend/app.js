const express = require("express");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const got = require("got");
const url =
  "mongodb+srv://Rzczrdo:Merry@cluster0.izrkc.mongodb.net/ShopifyCalendar?retryWrites=true&w=majority";

const app = express();

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const con = mongoose.connection;

con.on("open", () => {
  console.log("Connected to Server");
});

app.use(express.json());

const shoeRouter = require("./routes/shoes");
app.use("/", shoeRouter);

app.listen(process.env.PORT || 9000, () => {
  console.log("Server started");
});
