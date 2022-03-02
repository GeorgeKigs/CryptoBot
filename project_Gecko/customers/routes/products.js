const { getSingleProduct, getMostViewedProduct, searchProduct } = require("../../clients/controllers/products");
const { getAllProducts, getNearbyProducts, getProductCategory } = require("../controllers/products");

const route = require("express").Router();

route.get("/",getAllProducts);
route.get("/product/:productId",getSingleProduct);
route.get("/productSearch/:searchTerm",searchProduct);
route.get("/getMostViewedProduct",getMostViewedProduct);
route.get("/nearbyProducts",getNearbyProducts);
route.get("/getProductCategory/",getProductCategory);



module.exports = route;
