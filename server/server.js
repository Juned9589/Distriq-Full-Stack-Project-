import express from "express";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config(); // Load this first!

import colors from "colors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/dbConfig.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

// Middleware
import errorHandler from "./middleware/errorHandler.js";
import protect from "./middleware/authMiddleware.js";

// Controller
import giveAnswer from "./controller/chatController.js";

const PORT = process.env.PORT || 8080;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// init app
const app = express();
//CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// DB connection
connectDB();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ================= ROUTES =================



// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/coupons", couponRoutes);

// Chat routes
app.post('/api/chat', protect.forUser, giveAnswer);
app.post('/api/admin/chat', protect.forAdmin, giveAnswer);

const buildPath = path.resolve(__dirname, '../client/dist')

if (process.env.NODE_ENV === "production") {
    //Serve static files fro the build directory
    app.use(express.static(buildPath))

    //express v5 required a named parameter for wildcard (/*splat)
    app.get('./*splat', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'), (err) => {
            if (err) {
                //If index.html is missing , this provides a clearer error
                res.status(500).send("build file index.html not found. Ensure you ran 'npm run build' in the client ")
            }
        })
    })
} else {
    app.get("/", (req, res) => {
        res.send("API is running... (Development Mode )")
    })
}


// Error handler (always last)
app.use(errorHandler);

// ================= SERVER =================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.bgGreen.black);
});