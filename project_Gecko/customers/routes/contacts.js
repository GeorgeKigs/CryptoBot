const express = require("express");
const { postContacts } = require("../controllers/contact");

const router = express.Router();
const { validateContacts,messages } = require("../../utils/validation");
router.post("/",validateContacts,messages,postContacts);

module.exports = router;