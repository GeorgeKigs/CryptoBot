const { getCustomerData, editUsers, changePassword } = require("../controllers/user");


const router = require("express").Router();
router.route("/getUser")
	.post(editUsers)
	.get(getCustomerData);
router.post("/changePassword",changePassword);

module.exports = router;