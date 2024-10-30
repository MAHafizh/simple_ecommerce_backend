import express from "express";
import {
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  postProduct,
} from "../controller/products.js";

const router = express.Router();

router.get("/products", getProduct);
router.post("/products", postProduct);
router.get("/products/:id", getProductById);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
