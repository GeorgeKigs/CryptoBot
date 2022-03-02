const { getProducts, deleteProduct } = require("../../clients/controllers/products");
const { getAllProducts } = require("../../customers/controllers/products");

const router = require("express").Router();


router.get("/getProduct/:productId",getProducts);
router.post("/deleteProduct",deleteProduct);
router.post("/getAllProducts",getAllProducts);

module.exports = router;