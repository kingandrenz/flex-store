import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

// utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = [
  "https://3flexstore.netlify.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// REMOVED: Local static file serving for '/uploads'

app.get("/", (req, res) => {
  res.send("Hello flex-store");
});

// Error Handler must be placed LAST
app.use(errorHandler);

// Start server
app.listen(port, () => console.log(`Server running on port: ${port}`));

// // Ensure everything is in this order
// import path from "path";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import express from "express";
// import cors from "cors";

// // utils
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import errorHandler from "./middlewares/errorMiddleware.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";

// // Load environment variables
// dotenv.config();
// const port = process.env.PORT || 5000;

// // Connect to the database
// connectDB();

// // Create Express app
// const app = express();

// // Define the allowed origins ( frontend URLs)
// const allowedOrigins = [
//   'https://3flexstore.netlify.app',
//   'http://localhost:3000',
//   'http://localhost:5173'
// ];

// const corsOptions = {
//   origin: allowedOrigins,
//   credentials: true, // Allow cookies/headers/etc. to be sent with the request
// };

// app.use(cors(corsOptions));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// //  other middlewares
// app.use(errorHandler);

// // Routes

// app.use("/api/users", userRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/config/paypal", (req, res) => {
//   res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
// });

// // Make uploads folder static
// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// app.get("/", (req, res) => {
//   res.send("Hello flex-store");
// });

// // Start server
// app.listen(port, () => console.log(`Server running on port: ${port}`));
