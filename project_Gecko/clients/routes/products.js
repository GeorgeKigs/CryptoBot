const express = require("express");
const { getProducts, addProduct, editProduct, deleteProduct, getSingleProduct } = require("../controllers/products");
const { uploadProductPhotos } = require("../../utils/utils");
const { clientAuthorization, customerAuthorization } = require("../../utils/middleware");
const { validateProducts, messages } = require("../../utils/validation");
const router = express.Router();

router.get("/",getProducts);
router.delete("/deleteProduct",customerAuthorization,clientAuthorization,deleteProduct);
router.post("/getSingleProduct",getSingleProduct);
router.post("/addProduct",
	customerAuthorization,
	clientAuthorization,
	uploadProductPhotos,
	validateProducts,
	messages,
	addProduct
);
router.put("/editProduct",
	customerAuthorization,
	clientAuthorization,
	validateProducts,
	messages,
	editProduct
);


module.exports = router;