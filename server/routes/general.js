import express from "express";
import { getCustomer, getDashboardStats, getService } from "../controllers/general.js";

const router = express.Router();

router.get("/customer/:id", getCustomer);
router.get("/service/:id", getService);
router.get("/dashboard", getDashboardStats);

export default router;
