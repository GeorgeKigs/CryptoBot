const express = require("express");
const contact = require("./contacts");
const reviews = require("./reviews");
const auth = require("./auth");
const mpesa =  require("./mpesa");
const route = express.Router();
const products = require("./products");
const users = require("./users");
const { customerAuthorization } = require("../../utils/middleware");

/*
* main directory for all the routes in the customers url
*/

route.use("/",products);
route.use("/auth",auth);
route.use("/contacts",contact);
route.use("/reviews",reviews);
route.use("/mpesa",mpesa);
route.use("/user",customerAuthorization,users);
module.exports = route;