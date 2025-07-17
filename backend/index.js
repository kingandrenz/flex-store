// Ensure everything is in this order
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";

// utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";

// Load environment variables
dotenv.config();
const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  other middlewares
app.use(errorHandler);

// Routes

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello flex-store");
});

// Start server
app.listen(port, () => console.log(`Server running on port: ${port}`));
