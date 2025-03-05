const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
router.use(requireAuth);

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:productId", getProductById);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

module.exports = router;
