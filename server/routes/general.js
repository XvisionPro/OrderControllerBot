import express from "express";
import { getCustomer, getDashboardStats } from "../controllers/general.js";

const router = express.Router();

router.get("/customer/:id", getCustomer);
router.get("/dashboard", getDashboardStats);

export default router;
