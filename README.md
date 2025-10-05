# 📦 Shipping Cost Calculator

> A modern React SPA to calculate international shipping costs from India.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🚀 Overview

A clean, responsive web app to estimate and manage shipping costs for boxes sent internationally.

### ✨ Highlights

- 🧠 Real-time cost calculator  
- 📋 Box management with validation  
- 📊 Table + Card views  
- 📤 Export CSV, search, sort, delete  

---

## 🧰 Tech Stack

- **React 18**, **Context API**, **Hooks**  
- **Tailwind CSS**, **Lucide Icons**  
- **MVC Architecture**  
- **Simulated API Service**

---

## 📦 Features

- Add boxes with validation  
- View boxes in table or mobile card layout  
- Search, sort, and filter by country  
- Export data as CSV  
- Delete individual boxes  
- Real-time statistics: total cost, weight, boxes  

---

## 📁 Folder Structure

```
src/
├── components/         # UI components
├── context/            # App state (ShippingContext)
├── models/             # Logic & calculations (ShippingModel)
├── services/           # API simulation (ShippingService)
├── App.jsx, index.js   # Main files
```

---

## ⚙️ Installation

```bash
git clone https://github.com/yourusername/shipping-calculator.git
cd shipping-calculator
npm install
npm start
```

**Tailwind CSS Setup:**
```bash
npx tailwindcss init -p
```

**Optional `.env`:**
```env
REACT_APP_API_URL=http://localhost:3000/api
```

---

## 📌 Usage

- Go to "Add Box", fill in details (name, weight, color, country)
- Preview and save shipping cost
- View in the "View Boxes" table
- Use filters, search, delete, and export

---

## 🧠 Architecture (MVC)

- **Model:** `ShippingModel.js` — rates, validation, color conversion  
- **View:** `BoxForm`, `BoxTable`, `Navbar` — UI components  
- **Controller:** `ShippingContext.jsx` — app state & logic  
- **Service:** `ShippingService.js` — simulates API

---

## 🧪 Testing

```bash
npm test
npm test -- --coverage
```

---

## 🌍 Deployment

### Netlify
- Push to GitHub
- Connect via dashboard or CLI:
```bash
netlify deploy
```

### GitHub Pages
```bash
npm install gh-pages --save-dev
npm run build
npm run deploy
```

---

## 📡 API Simulation

```http
POST    /api/boxes      # Add new box
GET     /api/boxes      # Get all boxes
DELETE  /api/boxes/:id  # Delete box
```

(Replace with real API in `ShippingService.js` as needed)

---

## 📌 FAQ

- **Add more countries?** → Update `ShippingModel.countries`  
- **Persist data?** → Use `localStorage` or connect backend  
- **Change rates?** → Edit model  
- **Max weight?** → Configurable (default: 10,000kg)

---

## 📞 Contact

**Maintainer:** Your Name  
📧 pankajkmeena12@gmail.com  
🐙 [GitHub](https://github.com/pankaj061999)  

---

## 🔮 Roadmap

- User authentication  
- Backend API + database  
- Edit functionality  
- Label printing, multi-currency  
- Offline mode / PWA  
- Dark mode  
- Multi-language support  

---

## ⭐ Star this Repo

If this project helped you, give it a ⭐ on GitHub!

---
