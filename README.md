```
# 🛍️ LeafCart — AI-Powered Grocery Delivery Platform

A full-stack grocery delivery platform with an AI cart agent that understands natural language, searches real products, and manages your cart automatically.

<p align="center">
  <img src="https://github.com/Prodipsen27/grocery-app/blob/main/client/Leafcart.png" width="700"/>
</p>

---

## 🌐 Live Demo
👉 [Live Demo](https://leafcart-tan.vercel.app/)

---

## ✨ Features

### 🛒 E-Commerce
* JWT-based user authentication and session handling
* Product browsing with dynamic filtering and search
* Cart management and address handling
* Stripe integration for secure payment processing
* Seller/admin dashboard for inventory and order management
* Fully responsive layout using Tailwind CSS

### 🤖 AI Cart Agent (Powered by Gemini)
* Natural language shopping — just say "I want to cook Palak Paneer"
* Agent autonomously searches real MongoDB products
* Adds, removes, and updates cart items intelligently
* Isolated per-user memory — every user gets their own agent session
* Built with Gemini function calling (agentic loop architecture)

---

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React (Vite), Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI Agent | Google Gemini API (function calling) |
| Auth | JWT, Cookie-based sessions |
| Payments | Stripe API |
| Deployment | Vercel (frontend), Railway/Render (backend) |

---

## 🤖 AI Agent Architecture

```text
User: "I want to cook Palak Paneer"
        ↓
POST /api/agent/chat
        ↓
Gemini reasoning
        ↓
search_products("spinach")
        ↓
MongoDB product search
        ↓
add_to_cart(product_id, quantity)
        ↓
Cart updated in DB
        ↓
Response: "✅ Added 8 ingredients — total ₹370"

### Tools available to the agent:
* `search_products` — searches MongoDB catalog by name/category
* `add_to_cart` — adds item to user's cart in DB
* `remove_from_cart` — removes or reduces cart item
* `update_quantity` — sets exact quantity for a cart item
* `get_cart` — reads current cart with product details

---

## 🗺️ AI Agent Roadmap

- [x] Phase 1 — Per-user cart agent with real MongoDB
- [ ] Phase 2 — User food preferences (veg/nonveg, allergies)
- [ ] Phase 3 — Order history awareness and reorder suggestions
- [ ] Phase 4 — Smart recipe and product recommendations

---

## 📁 Folder Structure

LeafCart/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── main.jsx
│
├── server/                # Express backend
│   ├── agent/             # AI agent (Gemini)
│   │   ├── agent.js
│   │   ├── tools.js
│   │   └── toolHandlers.js
│   │
│   ├── configs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js

---

## 🧪 Local Development

Clone the repo:
```bash
git clone https://github.com/Prodipsen27/grocery-app.git
cd grocery-app
```

Install dependencies:
```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

Set up environment variables in `server/.env`:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
GEMINI_API_KEY=your_gemini_key
```

Run the development server:
```bash
# Backend
cd server && nodemon server.js

# Frontend
cd client && npm run dev
```

---

## 📌 Project Status

* ✅ Frontend: Complete
* ✅ Backend: Complete
* ✅ AI Agent Phase 1: Complete
* 🟡 AI Agent Phase 2-4: In Progress
* 📱 Responsive: Yes
* 🔐 Auth: JWT + Cookies

---

## 🧑‍💻 Author

Built with 💚 by Prodip
GitHub: [@Prodipsen27](https://github.com/Prodipsen27)

Future Enhancements
Personalized shopping based on user preferences
Smart reorder system using order history
AI-powered recipe recommendations
Voice-based shopping assistant
Multi-language support
```

