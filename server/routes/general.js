import express from "express";
import { getCustomer, getOrder, getService, getAllService, getAllCustomers, getAllOrders } from "../controllers/general.js";

const router = express.Router();

router.get("/customer/:id", getCustomer);
router.get("/service/:id", getService);
router.get("/order/:id", getOrder);

router.get("/services", getAllService);
router.get("/customers", getAllCustomers);
router.get("/orders", getAllOrders);
// router.get("/dashboard", getDashboardStats);

export default router;
