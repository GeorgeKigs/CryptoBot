const auth = require("./auth");
const payment = require("./Payment");
const products = require("./products");
const store = require("./Store");
const review = require("./reviews");
const user = require("./user");
const { customerAuthorization, clientAuthorization, authenticate } = require("../../utils/middleware");
const router = require("express").Router();

router.use("/auth",auth);
router.use("/payment",customerAuthorization,clientAuthorization,authenticate,payment);
router.use("/products",products);
router.use("/store",store);
router.use("/review",review);
router.use("/user",customerAuthorization,clientAuthorization,authenticate,user);

module.exports = router;