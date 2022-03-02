
const router = require("express").Router();
const { 
	login,
	registration, 
	confirmEmail, 
	changePassword,
	confirmPasswordEmail,
	forgotPassword 
} = require("../../admin/controllers/auth");
const { customerAuthorization, clientAuthorization } = require("../../utils/middleware");
const { validateLoginReq, messages, validateRegistrationReq, valPassword } = require("../../utils/validation");

router.post("/login",validateLoginReq,messages,login);
router.post("/registration",validateRegistrationReq,messages,registration);
router.post("/changePassword/",valPassword,messages,customerAuthorization,clientAuthorization,changePassword);
router.post("/forgotPassword",valPassword,messages,forgotPassword);
router.post("/confirmEmail/",confirmEmail);
router.post("/confirmPasswordEmail/",confirmPasswordEmail);
module.exports = router;









// passport middleware
// router.get("/login/facebook",
// 	passport.authenticate(
// 		"FacebookStrategy",{
// 			scope:["profile"]
// 		})
// );

// router.get("/login/facebook/callback",
// 	passport.authenticate("FacebookStrategy",{
// 		failureRedirect:"/failure"
// 	}),
// 	(req,res) => {
// 		res.status(200).json({
// 			success:true
// 		});
// 	}
// );

// router.get("login/google/",
// 	passport.authenticate("strategyGoogle",
// 		{
// 			scope:["profile"]
// 		}));

// router.get("/google/callback",
// 	passport.authenticate("google",
// 		{
// 			failureRedirect:"/failure"},(req,res)=>{
// 			res.status(200).json({success:true});
// 		}));

module.exports = router;