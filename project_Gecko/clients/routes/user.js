const express = require("express");
const { clientAuthorization, customerAuthorization, authenticate } = require("../../utils/middleware");
const { messages, validateRegistrationReq } = require("../../utils/validation");
const { getUsers, editUsers, deleteUsers, changePassword } = require("../controllers/user");

const router = express.Router();
router.get("/getUsers",customerAuthorization,clientAuthorization,getUsers);
router.post("/editUsers",validateRegistrationReq,messages,customerAuthorization,clientAuthorization,editUsers);
router.delete("/deleteUsers",customerAuthorization,clientAuthorization,authenticate,deleteUsers);
router.post("/changePassword",customerAuthorization,clientAuthorization,changePassword);

module.exports = router;