import { Response, Request, Router } from "express";
import Product from "../models/product";
import { protect, AuthRequest } from "../middlewares/auth";

const router = Router();

//Get all product with search + filter
router.get("/", async (req: Request, res: Response) => {
  const { search, category, minPrice, maxPrice } = req.query;
  const query: any = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice && !isNaN(Number(minPrice)))
      query.price.$gte = Number(minPrice);
    if (maxPrice && !isNaN(Number(maxPrice)))
      query.price.$lte = Number(maxPrice);
  }
  const products = await Product.find(query);
  res.json(products);
});

// Get product by id
router.get("/:id", async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(product);
});

//Create product
router.post("/", protect, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product", error: err });
  }
});

// REDUCE stock when order is placed
router.post(
  "/:id/reduce-stock",
  protect,
  async (req: AuthRequest, res: Response) => {
    try {
      const { quantity } = req.body;
      const product = await Product.findById(req.params.id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      if (product.stock < quantity) {
        res.status(400).json({ message: "Insufficient stock" });
        return;
      }
      product.stock -= quantity;
      await product.save();
      res.json({ message: "Stock updated", stock: product.stock });
    } catch (err) {
      res.status(500).json({ message: "Failed to update stock" });
    }
  },
);

// Update product
router.put("/:id", protect, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: false },
    );
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed", error: err });
  }
});

// Delete product
router.delete("/:id", protect, async (req: AuthRequest, res: Response) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product successfully deleted" });
});

export default router;
