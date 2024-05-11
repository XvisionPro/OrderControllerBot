import express from "express";
import { getCustomer, getOrder, getService } from "../controllers/general.js";

const router = express.Router();

router.get("/customer/:id", getCustomer);
router.get("/service/:id", getService);
router.get("/order/:id", getOrder);
// router.get("/dashboard", getDashboardStats);

export default router;
