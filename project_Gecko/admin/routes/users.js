
const { deleteUsers, getUsers } = require("../../clients/controllers/user");
const { getCustomerData } = require("../../customers/controllers/user");
const { getAllCustomers, getAllClients } = require("../controllers/user");
const route = require("express").Router();


route.get("/getCustomers",getAllCustomers);
route.get("/getClients",getAllClients);
route.get("/getClients",getUsers);
route.get("/getCustomer",getCustomerData);
route.delete("/deleteClientUser",deleteUsers);

module.exports = route;