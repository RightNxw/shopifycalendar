# Shoe Palace Release Calendar

A real-time sneaker release monitoring tool that scrapes the Shoe Palace monthly release calendar and displays all upcoming drops in one organized dashboard. Automatically tracks stock levels and variant information to help you cop shoes faster.

## Features

- **Automated Scraping**: Automatically scrapes Shoe Palace releases page every 2 hours
- **Real-Time Stock Tracking**: Monitors total stock and per-size availability for each release
- **Variant Information**: Displays all size variants with individual stock counts
- **Quick Copy**: One-click copying of variant IDs for checkout automation
- **Visual Calendar**: Clean, card-based UI showing all upcoming releases
- **Product Details**: Shows product name, price, release date, and images
- **Animated UI**: Sleek dark theme with animated starfield background

## Tech Stack

### Backend

- **Node.js** + **Express.js** - Server framework
- **MongoDB** (Atlas) - Database for storing shoe data
- **Cheerio** - HTML parsing and web scraping
- **Got** - HTTP client for fetching pages
- **Mongoose** - MongoDB object modeling

### Frontend

- **Vanilla JavaScript** - Dynamic UI generation
- **HTML5/CSS3** - Responsive design with custom animations
- **Fetch API** - Data retrieval from backend

## How It Works

1. **Scraper** (`backend/app.js`) runs every 2 hours:

   - Fetches https://www.shoepalace.com/pages/releases
   - Parses all upcoming shoe releases from the monthly calendar
   - For each shoe, retrieves detailed Shopify product JSON
   - Extracts variant IDs, stock levels, pricing, and release dates
   - Stores everything in MongoDB

2. **API** (`backend/routes/shoes.js`) provides endpoints:

   - `GET /shoesjson` - Returns all scraped shoes
   - `POST /newmonthentries` - Adds new shoe entries
   - `POST /clear` - Clears database before updates

3. **Frontend** (`frontend/`) displays the data:
   - Fetches latest shoes from API
   - Generates cards for each release
   - Shows expandable variant/stock information
   - Provides quick-copy functionality for variant IDs

## Installation

### Prerequisites

- Node.js (v12+)
- MongoDB Atlas account (or local MongoDB instance)

### Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd shopifycalendar
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure MongoDB**

   Update the MongoDB connection string in `backend/app.js`:

   ```javascript
   const url = "your-mongodb-atlas-connection-string";
   ```

4. **Start the server**

   ```bash
   npm start
   ```

   Server runs on `http://localhost:9000`

## Usage

### Viewing Releases

Simply visit the deployed app or `http://localhost:9000` to see the calendar.

### Understanding the Data

Each shoe card displays:

- Product image
- Shoe name
- Price
- Release date
- Total stock count
- **Display Variants** button - Shows size breakdown with stock per size
- **Copy Variants** button - Copies all variant IDs to clipboard

### Using Variant IDs

Click "Copy Variants" to get variant IDs for use with checkout bots or automation tools. These IDs are needed for faster checkout processes.

## Project Structure

```
shopifycalendar/
├── backend/
│   ├── app.js              # Express server + scraping logic
│   ├── models/
│   │   └── main.js         # Mongoose shoe schema
│   └── routes/
│       └── shoes.js        # API endpoints
├── frontend/
│   ├── index.html          # Main page
│   ├── index.js            # UI logic
│   ├── styles.css          # Main styles
│   └── styles2.css         # Animated background
├── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint           | Description                                |
| ------ | ------------------ | ------------------------------------------ |
| GET    | `/shoesjson`       | Retrieve all shoes from database           |
| POST   | `/newmonthentries` | Add a new shoe entry                       |
| POST   | `/clear`           | Clear all shoes (requires `{clear: true}`) |

## Data Schema

Each shoe entry contains:

```javascript
{
  name: String,        // Shoe name
  url: String,         // Product page URL
  price: Number,       // Price in USD
  date: String,        // Release date (e.g., "Nov 15")
  image: String,       // Image URL
  stock: Number,       // Total stock across all sizes
  sizeVars: Array,     // Size variants with IDs
  vars: Array,         // Variant IDs only
  stockList: Array,    // Stock count per size
  time: String         // Release time (optional)
}
```

## Deployment

Currently deployed on **Heroku**:

- Set environment variable: `PORT` (Heroku assigns automatically)
- Configure MongoDB Atlas connection string
- Push to Heroku: `git push heroku main`

## Configuration

### Update Frequency

Scraper runs every **2 hours** by default. To change, modify in `backend/app.js`:

```javascript
setTimeout(update, 7200000); // 7200000ms = 2 hours
```

### Scraping Delay

**30 seconds** delay between database clear and scrape. Modify in `backend/app.js`:

```javascript
setTimeout(grab, 30000); // 30000ms = 30 seconds
```

## Important Notes

- This tool is for **personal use** and educational purposes
- Respect Shoe Palace's `robots.txt` and terms of service
- The scraper makes HTTP requests to public pages only
- No authentication bypass or private API exploitation
- Use responsibly and avoid excessive request rates

## License

This project is for educational and personal use only.

## Troubleshooting

**No shoes displaying:**

- Check if MongoDB connection is active
- Verify scraper has run (check console logs)
- Ensure Shoe Palace releases page structure hasn't changed

**Scraper failing:**

- Shoe Palace may have updated their HTML structure
- Check network connectivity
- Verify the releases page URL is still valid

**Variant IDs not copying:**

- Ensure browser allows clipboard access
- Check browser console for JavaScript errors
