import { Router, Response } from "express";
import Order from "../models/order";
import { protect, AuthRequest } from "../middlewares/auth";

const router = Router();

// Place order
router.post("/", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { items, total } = req.body;
    const order = await Order.create({ userId: req.userId, items, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to place order" });
  }
});

// Get user orders
router.get("/", protect, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;
