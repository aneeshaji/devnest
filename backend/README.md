# DevNest Backend – Technical Blogging API

This is the backend service for DevNest, a technical blogging platform.  
Built using **Node.js, Express, MongoDB**, and structured with MVC architecture.

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

Create .env

```bash
PORT=5000
MONGODB_URI=your_connection_string
JWT_SECRET=your_secret
NODE_ENV=development
```

Run the server

```bash
node server / node server.js
```

Backend runs on:

```bash
http://localhost:5000
```

📡 API Modules
🔐 Authentication

Register

Login

Get logged-in user

Update profile

📝 Articles

Create blog posts

Edit/delete

Publish/unpublish

Drafts

Slug generation

Trending posts

💬 Comments

Add

Edit

Delete

Replies

👤 Users

Public profile

Author's articles

📁 Folder Structure

```bash
backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
└── server.js
```

🧪 Quick Test (Postman)

POST /api/auth/register

POST /api/auth/login

POST /api/articles (Requires token)

GET /api/articles

## 📜 License

This project is open source and available under the **MIT License**.
