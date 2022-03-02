const router = require("express").Router();
const { 
	login, 
	confirmEmail, 
	changePassword,
	confirmPasswordEmail,
	forgotPassword 
} = require("../controllers/auth");
const { customerAuthorization,adminAuthorization } = require("../../utils/middleware");
const { validateLoginReq, messages, valPassword, valEmail } = require("../../utils/validation");




router.post("/login",validateLoginReq,messages,login);
router.post("/confirmEmail/",confirmEmail);
router.post("/changePassword/",valPassword,messages,customerAuthorization,adminAuthorization,changePassword);
router.post("/forgotPassword",valEmail,messages,forgotPassword);
router.post("/confirmPasswordEmail/",confirmPasswordEmail);

module.exports = router;