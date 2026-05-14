import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Must be first

import cors from "cors";
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

// Build path (defined early so it's available everywhere)
const buildPath = path.resolve(__dirname, "../client/dist");

// ================= CORS =================
// FIX 1: allowedOrigins was missing entirely
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// ================= APP INIT =================
const app = express();

// FIX 2: Apply CORS + preflight before anything else
app.use(cors(corsOptions));
app.options("/{*path}", cors(corsOptions)); // Handle preflight for all routes

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ================= DB + ENV CHECKS =================
connectDB();

if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.".bgRed.white);
    process.exit(1);
}

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/coupons", couponRoutes);

app.post("/api/chat", protect.forUser, giveAnswer);
app.post("/api/admin/chat", protect.forAdmin, giveAnswer);

// ================= STATIC / CATCH-ALL =================
// FIX 3: catch-all was placed before routes and before buildPath was defined
if (process.env.NODE_ENV === "production") {
    app.use(express.static(buildPath));

    app.use("/{*path}", (req, res, next) => {
        if (req.originalUrl.startsWith("/api")) {
            return next();
        }
        res.sendFile(path.join(buildPath, "index.html"), (err) => {
            if (err) next(err);
        });
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running... (Development Mode)");
    });
}

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= SERVER =================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.bgGreen.black);
});