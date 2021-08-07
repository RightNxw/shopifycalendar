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

app.listen(9000, () => {
  console.log("Server started");
});

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function update() {
  const domain = "https://www.shoepalace.com";
  const urlShoes = domain + "/pages/releases";

  const fetchHtml = async (url) => {
    try {
      return (await got(url)).body;
    } catch (e) {
      console.error(e);
    }
  };

  const getShoes = async () => {
    const html = await fetchHtml(urlShoes);

    if (typeof html === "string") {
      const $ = cheerio.load(html);
      const shoes = $(".vb > .js-collectionBlock");
      const shoesValues = [];

      for (shoe of shoes) {
        const shoeSelector = $.load(shoe);
        const image = $(shoeSelector(".collectionBlock-image"));
        const name = image.attr("title");
        const url =
          domain + image.find(".collectionBlock-image__link").attr("href");
        const day = $(shoeSelector(".date > .mon")).text();
        const month = $(shoeSelector(".date > .day")).text();
        const date = day + " " + month;
        const json = JSON.parse(await fetchHtml(url + ".json"));
        const srcImage = json.product.image.src;
        stock = "";
        stockNum = [0];
        for (let i in json["product"]["variants"]) {
          stock = `${json["product"]["variants"][i]["inventory_quantity"]}`;

          stockNum.push(stock);
        }
        num = 0;

        for (var i = 0; i < stockNum.length; i++) {
          num += +stockNum[i];
        }

        newStock = Math.abs(num);

        let sizeVariantListStock = "";

        for (let i in json["product"]["variants"]) {
          sizeVariantListStock += `${json["product"]["variants"][i]["title"]} | ${json["product"]["variants"][i]["inventory_quantity"]}\n`;
          sizeVariantListStock = sizeVariantListStock.replace("-", "");
        }

        let sizeVariantList = "";
        let variantList = "";

        let price = json.product.variants[0]["price"];

        const sizeOption = json["product"]["options"].find(
          (option) => option["name"] == "Size"
        );
        for (let i in sizeOption["values"]) {
          sizeVariantList += `${sizeOption["values"][i]} - ${json["product"]["variants"][i]["id"]}\n`;
          variantList += `${json["product"]["variants"][i]["id"]}\n`;
        }
        await got.post("http://localhost:9000/newmonthentries", {
          json: {
            name: name,
            url: url,
            price: price,
            date: date,
            image: srcImage,
            stock: newStock,
            sizeVars: [sizeVariantList],
            vars: [variantList],
            stockList: [sizeVariantListStock],
          },
        });
      }

      return shoesValues;
    } else {
      console.error(`The given link doesn't return any HTML`);
    }
  };

  (async () => {
    got.post("http://localhost:9000/clear", {
      json: {
        clear: true,
      },
    });
    console.log("clearing" + new Date().toUTCString());
    await sleep(30000);
    console.log("Updating" + new Date().toUTCString());
    await getShoes();
    console.log("done" + new Date().toUTCString());
  })();
}
setTimeout(update, 7200000);
