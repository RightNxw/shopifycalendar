let jsonShoes;
fetch("https://andromeda-tools.herokuapp.com/shoesjson", {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  method: "GET",
})
  .then((res) => res.json())
  .then((res) => {
    jsonShoes = res;
  })
  .then(() => {
    class P {
      constructor(text) {
        this.p = document.createElement("p");
        this.p.textContent = text;
        return this.p;
      }
    }

    class Div {
      constructor() {
        this.div = document.createElement("div");
        return this.div;
      }
    }

    class Img {
      constructor(url) {
        this.img = document.createElement("img");
        this.img.src = url;
        this.img.classList.add("image-shoe");
        this.centerImg = new Div();
        this.centerImg.classList.add("center-img");
        this.centerImg.appendChild(this.img);
        this.containerImg = new Div();
        this.containerImg.classList.add("container-img");
        this.containerImg.appendChild(this.centerImg);
        return this.containerImg;
      }
    }

    class TableCell {
      constructor(text) {
        this.td = document.createElement("td");
        this.td.textContent = text;
        return this.td;
      }
    }

    class TableBody {
      constructor(rows) {
        this.tbody = document.createElement("tbody");
        this.tbody.classList.add("table-body-information");
        for (const row of rows) this.tbody.appendChild(row);
        return this.tbody;
      }
    }

    class TableRow {
      constructor(cells) {
        this.tr = document.createElement("tr");
        for (const cell of cells) this.tr.appendChild(new TableCell(cell));
        return this.tr;
      }
    }

    class Table {
      constructor(id, rows, isVisible) {
        this.table = document.createElement("table");
        this.table.classList.add("table-information");
        this.table.id = id;

        const tableRows = [];
        for (const row of rows) tableRows.push(new TableRow(row));

        this.table.appendChild(new TableBody(tableRows));
        if (!isVisible) this.table.classList.add("table-hidden");
        return this.table;
      }
    }

    class Button {
      constructor(cardId, text) {
        this.id = `button-${cardId}`;
        this.button = document.createElement("button");
        this.button.classList.add("btn");
        this.button.textContent = text;
        this.button.addEventListener("click", this.getHandleClick(cardId));
        this.button.id = this.id;
        return this.button;
      }

      getHandleClick(cardId) {
        const handleClick = () => {
          const tableToggle = document.getElementById(`table-sizes-${cardId}`);
          const btn = document.getElementById(this.id);
          if (tableToggle.classList.contains("table-hidden")) {
            tableToggle.className = "table-information";
            btn.textContent = "Hide Variants";
          } else {
            tableToggle.classList.add("table-hidden");
            btn.textContent = "Display Variants";
          }
        };

        return handleClick;
      }
    }

    class Card {
      constructor(id, title, url) {
        this.id = `card-${id}`;
        this.initCard();
        this.setTitle(title);
        this.setImage(url);
        this.setButton(id);
      }

      build() {
        return this.card;
      }

      initCard() {
        this.card = new Div();
        this.card.classList.add("card");
        this.card.id = this.id;
      }

      setTitle(title) {
        this.title = new P(title);
        this.title.classList.add("name-shoe");
        this.card.appendChild(this.title);
      }

      setImage(url) {
        this.image = new Img(url);
        this.card.appendChild(this.image);
      }

      addTable(id, rows, isVisible = true) {
        this.table = new Table(`${id}-${this.id}`, rows, isVisible);
        this.card.appendChild(this.table);
      }

      setButton() {
        this.button = new Button(this.id, "Display Variants");
        this.card.appendChild(this.button);
      }
    }

    const cards = [];

    jsonShoes.forEach((shoe, idx) => {
      const tableInformation = [
        ["Total Price", "Release Date", "Total Stock"],
        [shoe.price, shoe.date, shoe.stock],
      ];

      const tableSizes = [
        ["Variants", "Variants With Stock", "Stock", "Mass Variants Link"],
      ];

      const vars = shoe.vars[0].split("\n");
      const sizeVars = shoe.sizeVars[0].split("\n");
      const stock = shoe.stockList[0].split("\n");
      const MassVariants = shoe.MassVariants;

      var link = document.createElement("a");
      link.setAttribute("href", shoe.MassVariants);
      link.className = "someCSSclass";
      // For IE only, you can simply set the innerText of the node.
      // The below code, however, should work on all browsers.
      var linkText = document.createTextNode("Click me");
      link.appendChild(linkText);

      for (let i = 0; i < vars.length - 1; i++)
        tableSizes.push([vars[i], sizeVars[i], stock[i]]);
      tableSizes.push(link);

      const card = new Card(idx, shoe.name, shoe.image);
      card.addTable("table-information", tableInformation);
      card.addTable("table-sizes", tableSizes, false);
      cards.push(card.build());
    });

    const root = document.getElementById("root");

    const containerCards = new Div();
    containerCards.classList.add("container-cards");

    for (const card of cards) containerCards.appendChild(card);

    root.appendChild(containerCards);
  });
