const route = require("express").Router();

const { customerAuthorization, adminAuthorization } = require("../../utils/middleware");
const auth = require("./auth");
const user = require("./users");
const product = require("./products");
const store = require("./stores");

route.use("/auth",auth);
route.use("/users",customerAuthorization,adminAuthorization,user);
route.use("/product",customerAuthorization,adminAuthorization,product);
route.use("/store",customerAuthorization,adminAuthorization,store);

module.exports = route;