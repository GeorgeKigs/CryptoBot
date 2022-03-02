const router = require("express").Router();
const { 
	login,
	registration, 
	confirmEmail, 
	confirmPasswordEmail,
	forgotPassword 
} = require("../../admin/controllers/auth");
const { 
	validateLoginReq,
	validateRegistrationReq, 
	valPassword, 
	valEmail,
	messages 
} = require("../../utils/validation");


router.post("/login",validateLoginReq,messages,login);
router.post("/registration",(req,res,next)=>{
	console.log(req.body);
	next();
},validateRegistrationReq,messages,registration);
router.post("/confirmEmail/",confirmEmail);

// change the token requirements
// router.post("/changePassword/",customerAuthorization,changePassword);
router.post("/forgotPassword",valEmail,messages,forgotPassword);
router.post("/confirmPasswordEmail/",valPassword,messages,confirmPasswordEmail);

module.exports = router;
