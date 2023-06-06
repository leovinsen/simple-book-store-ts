import { Router } from "express";
import { createOrder } from "../controller/orders/createOrder";
import { getOrders } from "../controller/orders/getOrders";

const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);

export default router;
