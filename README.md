# 👑 PAITHANI VASTRAM (पैठणी वस्त्रम)
### *The Royal Heritage of Handwoven Silk Sarees • Yeola & Paithan*

A modern, luxury full-stack **MERN** (MongoDB, Express, React, Node.js) web application built for **PAITHANI VASTRAM**, featuring your **personal handwoven saree collection**, live zoom inspection, an interactive **Personal Saree Studio** for uploading new saree photos, shopping cart, and direct WhatsApp order inquiry.

---

## 🌟 Key Features

1. **Personal Saree Collection**:
   - Pre-loaded with all **19 personal saree photographs** from your collection (`1000078648.jpg` to `1000162518.jpg`).
   - Detailed weave specifications for each saree: Fabric (*100% Pure Mulberry Silk*), Zari Quality (*Tested 24K Gold Zari*), Pallu Motif (*Mor Bangadi, Popat Maina, Asavali*), Saree Dimensions (6.3m with blouse piece), and Silk Mark Certification.

2. **Personal Saree Upload Studio**:
   - An interactive studio modal allowing you to upload any personal saree photo from your computer (JPG, PNG, WebP).
   - Form fields for title, Marathi title, price, original MRP, color, pallu motifs, border type, and description.
   - Automatically saves to the backend API (`/api/upload` & `/api/sarees`) and updates the live catalog instantly!

3. **Luxury Royal Indian Aesthetic**:
   - Palette inspired by Maharashtrian royalty: Deep Velvet Purple (`#1e0524`), Crimson Red, Lush Emerald, and Radiant Gold (`#d4af37`).
   - Typography: Google Fonts `Cinzel`, `Playfair Display`, and `Plus Jakarta Sans`.
   - Custom-generated royal peacock emblem logo (`/logo.jpg`) and cinematic palace bride hero banner (`/hero.jpg`).

4. **E-Commerce & Weaving Studio Capabilities**:
   - **Multi-Filter & Search**: Instant filtering by Category (*Bridal, Pure Silk, Kadiyal, Brocade, Yeola Special*), Color, Pallu Motif (*Mor Bangadi, Popat Maina, Asavali*), and Price sorting.
   - **High-Resolution Quick View Modal**: Interactive click-to-zoom feature revealing intricate handloom weave details.
   - **Direct WhatsApp Order**: Pre-filled message with the saree title, price, and inquiry for video inspection directly to your WhatsApp (`+91 72191 20935`).
   - **Slide-Out Royal Shopping Bag**: Modify quantities, apply coupon codes (e.g. `VASTRAM10` for 10% off), and view order breakdown.
   - **Checkout System**: Supports WhatsApp Weaver Priority Order, Cash on Delivery (COD), and UPI / Online payment.
   - **Wishlist Drawer**: Save favorite weaves and move them to bag in one click.

---

## 📂 Project Structure

```
PAITHANI VASTRAM/
├── backend/
│   ├── data/
│   │   ├── db.json               # Persistent local datastore fallback
│   │   ├── seedData.js           # Pre-loaded 19 personal saree records
│   │   └── store.js              # Resilient dual-mode Mongo + Local DataStore
│   ├── models/
│   │   ├── Saree.js              # Mongoose Schema for Sarees
│   │   └── Order.js              # Mongoose Schema for Customer Orders
│   ├── routes/
│   │   ├── sareeRoutes.js        # GET, POST, DELETE /api/sarees
│   │   ├── uploadRoutes.js       # Multer multipart upload /api/upload
│   │   └── orderRoutes.js        # POST, GET /api/orders
│   ├── uploads/
│   │   └── sarees/               # Uploaded personal saree images
│   ├── .env                      # PORT=5000, MONGO_URI
│   ├── package.json
│   └── server.js                 # Express server & API routes
│
├── frontend/
│   ├── public/
│   │   ├── hero.jpg              # Royal palace bride hero banner
│   │   ├── logo.jpg              # Custom gold peacock brand emblem
│   │   └── sarees/               # Personal saree image assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── CartDrawer.jsx    # Slide-over shopping cart
│   │   │   ├── CheckoutModal.jsx # Checkout form & order confirmation
│   │   │   ├── Footer.jsx        # Store info, Yeola address & silk care
│   │   │   ├── HeritageStory.jsx # 2,000-year history of Paithani weaves
│   │   │   ├── Hero.jsx          # Royal hero showcase
│   │   │   ├── Icons.jsx         # Custom SVG icon set
│   │   │   ├── Navbar.jsx        # Sticky navigation & search
│   │   │   ├── SareeCard.jsx     # Saree card with quick view & bag action
│   │   │   ├── SareeModal.jsx    # High-res zoomable modal with weave specs
│   │   │   ├── UploadModal.jsx   # Personal Saree Studio upload modal
│   │   │   └── WishlistDrawer.jsx# Saved weaves drawer
│   │   ├── App.jsx               # Main application component
│   │   ├── index.css             # Royal CSS design system
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js            # Port 3000 & /api proxy to port 5000
│
└── package.json                  # Root runner scripts
```

---

## 🚀 How to Run

### 1. Start the Backend API Server
Open a terminal in the root folder:
```bash
cd backend
npm start
```
*The backend will run on **http://localhost:5000**.*
*(If local MongoDB is running, it connects automatically; if not, it automatically uses the built-in resilient datastore without crashing!)*

### 2. Start the Frontend React App
In a second terminal:
```bash
cd frontend
npm run dev
```
*The website will open on **http://localhost:3000**.*

---

## 📸 Adding Your Personal Saree Images
1. **Via the Website UI**: Click the **"+ Add Personal Saree"** button in the navbar or hero section, select/drop any photo, fill in title and price, and click **"Add Saree to Paithani Vastram"**.
2. **Via Local Folder**: You can also drop any image directly into `backend/uploads/sarees/` or `frontend/public/sarees/`.
