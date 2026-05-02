# 🎟️ Distriq — Full Stack Event Booking Platform

Distriq is a modern **full-stack MERN application** for discovering, managing, and booking events. It combines an intuitive user experience with a powerful admin dashboard and AI-powered chat assistance.

---

## 🚀 Features

### 👤 User Features

* Browse and explore events by category
* View detailed event information
* Book tickets seamlessly
* Manage personal bookings
* AI-powered chat assistant for queries

### 🛠️ Admin Features

* Create, update, and delete events
* Manage users, orders, and ratings
* Coupon system for discounts
* Admin dashboard with insights

### 🤖 AI Integration

* Chat assistant for user queries
* Role-based chat (User/Admin)

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* Redux Toolkit
* Tailwind CSS
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Other Tools

* JWT Authentication
* Cloudinary (for image uploads)
* Concurrently (for dev workflow)

---

## 📁 Project Structure

```
Distriq-Full-Stack-Project/
│
├── client/               # React frontend
│   ├── src/
│   └── public/
│
├── server/               # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── config/
│
├── uploads/              # Uploaded files
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/Distriq-Full-Stack-Project.git
cd Distriq-Full-Stack-Project
```

---

### 2️⃣ Install dependencies

```bash
npm install
cd client
npm install
cd ..
```

---

### 3️⃣ Environment Variables

Create a `.env` file in root:

```env
PORT=8080
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

---

### 4️⃣ Run the project (development)

```bash
npm run dev
```

* Frontend → http://localhost:5173 (or 5174)
* Backend → http://localhost:8080

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Deployment

This project is optimized for **monolithic deployment**.

Recommended platform:

* Render

---

## 📸 Screenshots

> Add screenshots here (Home, Admin Dashboard, Event Page)

---

## 🧠 Key Learnings

* Full-stack MERN architecture
* Redux state management
* REST API design
* Authentication & role-based access
* Deployment & production setup

---

## 📌 Future Improvements

* Payment gateway integration
* Real-time notifications
* Advanced analytics dashboard
* Mobile responsiveness enhancements

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Juned Bhutto**

* GitHub: https://github.com/Juned9589
* LinkedIn: www.linkedin.com/in/juned-bhutto-80b71435a

---

⭐ If you like this project, consider giving it a star!
