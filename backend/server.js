import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/dbConnection.js';
import errorHandler from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { loadTrie } from './controllers/placeController.js';

dotenv.config(); // Load environment variables

// Debugging: Check if env variables are loaded properly
console.log("🔍 CONNECTION_STRING:", process.env.CONNECTION_STRING || "Not Found");

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_DOMAIN,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/place", placeRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Ensure DB connection before starting server
connectDb().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server is running on port ${port}`);
        loadTrie();
    });
}).catch(err => {
    console.error("❌ Server failed to start due to DB connection error:", err);
});
