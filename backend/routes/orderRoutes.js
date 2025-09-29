import express from "express";
const router = express.Router();

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { createOrder } from "../controllers/orderController.js";

router.route("/").post(authenticate, createOrder);

export default router;
