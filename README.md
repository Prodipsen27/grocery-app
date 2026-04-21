Here’s your **complete, polished `README.md` in one go** — ready to copy-paste:

---

````markdown
# 🛍️ LeafCart — AI-Powered Grocery Delivery Platform

A full-stack grocery delivery platform with an AI cart agent that understands natural language, searches real products, and manages your cart automatically.

<p align="center">
  <img src="https://github.com/Prodipsen27/grocery-app/blob/main/client/Leafcart.png" width="700"/>
</p>

---

## 🌐 Live Demo
👉 https://leafcart-tan.vercel.app/

---

## ✨ Features

### 🛒 E-Commerce
- JWT-based user authentication and session handling  
- Product browsing with dynamic filtering and search  
- Cart management and address handling  
- Secure payments via Stripe integration  
- Seller/Admin dashboard for inventory and order management  
- Fully responsive UI using Tailwind CSS  

### 🤖 AI Cart Agent (Powered by Gemini)
- Natural language shopping (e.g., *"I want to cook Palak Paneer"*)  
- Autonomous product search from real MongoDB catalog  
- Intelligent cart operations (add, remove, update items)  
- Per-user isolated memory (session-aware agent)  
- Built using Gemini function calling (agentic loop architecture)  

---

## 🚀 Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Frontend     | React (Vite), Tailwind CSS, React Router v6 |
| Backend      | Node.js, Express.js |
| Database     | MongoDB, Mongoose |
| AI Agent     | Google Gemini API (Function Calling) |
| Auth         | JWT, Cookie-based Sessions |
| Payments     | Stripe API |
| Deployment   | Vercel (Frontend), Railway/Render (Backend) |

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
````

### 🧠 Available Agent Tools

* `search_products` → Search catalog by name/category
* `add_to_cart` → Add item to user cart
* `remove_from_cart` → Remove or decrement item
* `update_quantity` → Set exact quantity
* `get_cart` → Fetch full cart with product details

---

## 🗺️ AI Agent Roadmap

* [x] Phase 1 — Per-user cart agent with real MongoDB
* [ ] Phase 2 — User preferences (veg/non-veg, allergies)
* [ ] Phase 3 — Order history awareness and reorder suggestions
* [ ] Phase 4 — Smart recipe and product recommendations

---

## 📁 Folder Structure

```bash
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
```

---

## 🧪 Local Development

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Prodipsen27/grocery-app.git
cd grocery-app
```

### 2️⃣ Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3️⃣ Setup environment variables

Create `server/.env`:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
GEMINI_API_KEY=your_gemini_key
```

### 4️⃣ Run the project

```bash
# Backend
cd server
nodemon server.js

# Frontend
cd client
npm run dev
```

---

## 📌 Project Status

* ✅ Frontend: Complete
* ✅ Backend: Complete
* ✅ AI Agent Phase 1: Complete
* 🟡 AI Agent Phase 2–4: In Progress
* 📱 Responsive: Yes
* 🔐 Auth: JWT + Cookies

---

## 🧑‍💻 Author

**Prodip**
GitHub: [https://github.com/Prodipsen27](https://github.com/Prodipsen27)

---

## 💡 Future Enhancements

* Personalized shopping based on user preferences
* Smart reorder system using order history
* AI-powered recipe recommendations
* Voice-based shopping assistant
* Multi-language support

---


