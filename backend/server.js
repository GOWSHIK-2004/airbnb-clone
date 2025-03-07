import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/dbConnection.js";
import errorHandler from "./middleware/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { loadTrie } from "./controllers/placeController.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Ensure database connects before the server starts
(async () => {
    await connectDb();
})();

app.use(
    cors({
        origin: process.env.FRONTEND_DOMAIN, // Ensure this is set in .env
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/place", placeRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`🚀 Server is listening on port ${port}`);
    loadTrie(); // Ensure this doesn't break if DB is not ready
});
