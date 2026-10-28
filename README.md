# BEYOND — DROP_001 / The Concrete Study

> **BEYOND** is an independent dark luxury streetwear label built at the intersection of raw industrial architecture and brutalist garment construction. Heavy cottons, raw seams, and tactile silhouettes engineered to wear in and wear out.

---

## ⚡ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (v9 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/bhuvanchander2727/beyondv8.git

# Navigate to the project directory
cd beyondv8

# Install dependencies
npm install

# Start local development server
npm run dev
```

The site will be available at `http://localhost:5180/` (or the port specified in `vite.config.js`).

---

## 🛠️ Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launch local Vite development server with HMR |
| `npm run build` | Compile optimized production bundle to `dist/` |
| `npm run preview` | Locally preview the production build output |

---

## 📁 Project Structure

```
beyondv8/
├── public/                 # Static assets served as-is
│   └── assets/
│       ├── about/          # Founder editorial assets & documentation
│       ├── contact-sheet/  # 35mm campaign contact sheet photos
│       ├── fonts/          # Self-hosted Outfit font files & css
│       ├── hero/           # Hero boutique & model photography
│       └── *.webp / *.mp4  # Garment photos & campaign videos
├── src/
│   ├── components/         # Modular UI components (nav, cartDrawer, ticker, etc.)
│   ├── data/               # Structured data (founders, catalogue metadata)
│   ├── engine/             # Canvas background & interactive engines
│   ├── pages/              # SPA route views (home, shop, product, about, contact)
│   ├── router/             # Client-side router & route interceptors
│   ├── store/              # Cart state management (with localStorage sync)
│   ├── styles/             # Modular CSS stylesheets (hero, shop, manifesto, etc.)
│   ├── content.js          # Centralized editorial and brand copy
│   ├── main.js             # Application entry point
│   └── products.json       # Product archive catalog
├── index.html              # HTML5 entry point
├── package.json            # Project manifest & scripts
├── vite.config.js          # Vite configuration
└── README.md               # Documentation
```

---

## 💎 Features & Architecture

- **Zero Heavy Framework Bloat:** Ultra-fast, zero-runtime overhead built with modern native JavaScript (ES Modules).
- **Client-Side SPA Router:** Seamless, fluid navigation across Home, Shop, Product Details, About, Contact, and Checkout.
- **Dynamic 1-Bit Dither Engine:** Procedural canvas texture & dither algorithms mirroring brutalist industrial aesthetic.
- **Cart & Bag Engine:** Interactive slide-out drawer with colorway and size selection, quantity controls, and persistent storage.
- **High-Performance Assets:** Modern `.webp` image assets, local `.woff2` webfonts, and optimized `.mp4` background fashion loops.
- **Responsive & Accessible:** Fluid clamp-based responsive typography, semantic HTML5, and WCAG-compliant controls.

---

## 📜 License & Ownership

© 2026 BEYOND. All rights reserved.
