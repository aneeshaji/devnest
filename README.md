# DevNest – Technical Blogging Platform

DevNest is a modern **technical blogging platform** built as a monorepo with both frontend and backend inside a single repository.

## 📁 Project Structure

devnest/
├── frontend/ # UI for technical blogs
├── backend/ # REST API for articles, users, comments

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aneeshaji/devnest.git
cd devnest

```

🛠 Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at:

```bash
http://localhost:5000
```

🎨 Frontend Setup

```bash
http://localhost:5173 (Vite)
or
http://localhost:3000 (Next.js)
```

🔗 Environment

```bash
VITE_API_URL=http://localhost:5000/api
```

✨ Features

Write & publish technical blog posts

Developer profiles

Comments & discussions

Tags, categories & trending

Reading time & views

JWT authentication

## 📜 License

This project is open source and available under the **MIT License**.
