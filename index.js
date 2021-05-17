const cheerio = require("cheerio");
const got = require("got");

const domain = "https://www.shoepalace.com";
const urlShoes = domain + "/pages/releases";

const fetchHtml = async (url) => {
  try {
    return (await got(url)).body;
  } catch (e) {
    console.error(e);
  }
};

const showShoe = ({ name, date, url, srcImage, newStock }) => {
  const separetor = `---------------`;
  const outputLiteral = [
    separetor,
    `Name: ${name}`,
    `Date: ${date}`,
    `Link: ${url}`,
    `SrcImage: ${srcImage}`,
    `Stock: ${newStock}`,
    separetor,
  ];
  console.log(outputLiteral);
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
      let sizeVariantList = "";
      let productTitle = json.product.title;
      let productImage = json.product.image["src"];
      let price = json.product.variants[0]["price"];

      for (let i in json["product"]["variants"]) {
        sizeVariantList += `${json["product"]["variants"][i]["title"]} | ${json["product"]["variants"][i]["inventory_quantity"]}\n`;
        sizeVariantList = sizeVariantList.replace("-", "");
      }

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
      shoesValues.push({ name, date, url, srcImage, newStock });
    }

    return shoesValues;
  } else {
    console.error(`The given link doesn't return any HTML`);
  }
};

(async () => {
  const shoes = await getShoes();
  for (shoe of shoes) showShoe(shoe);
})();
