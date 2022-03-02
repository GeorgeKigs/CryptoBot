const { resErrors } = require("./errorHandling");

const route = require("express").Router();
route.get("/",resErrors);
module.exports = route;