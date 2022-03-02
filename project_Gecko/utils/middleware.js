const { generateTokenPayload, getModel } = require("./utils");
const CustomerUser = require("../customers/models/user");
const clientUser = require("../clients/models/user");
const userAdmin = require("../admin/models/users");

exports.customerAuthorization = async (req,res,next) =>{
	try{
		let token = req.headers["authorization"];
		token = token && token.split(" ")[1];
		if (!token){
			res.status(401).json({
				status:403,
				message:"UnAuthorized Admins Only"
			});
			res.end();
		}
		const payload = generateTokenPayload(token);
		req.token = payload;
		next();
	}catch(error){
		next(error);
	}
};

exports.clientAuthorization = async (req,res,next) =>{
	try {
		const token = req.token;
		if (token.client == true){
			next();
		}
		res.status(401).json({
			status:403,
			message:"UnAuthorized Admins Only"
		});
		res.end();
	} catch (error) {
		next(error);
	}
};

exports.adminAuthorization = async (req,res,next) =>{
	try {
		const token = req.token;
		if (token.admin == true){
			next();
		}
		
		res.status(401).json({
			status:403,
			message:"UnAuthorized Admins Only"
		});
		res.end();
	} catch (error) {
		next(error);
	}
};

exports.authenticate = async(req,res,next) =>{
	try{
		const userId = req.token.userId;
		
		let user = await getModel(req.originalUrl);
		let userDetails;
		if (user == "userAdmin"){
			userDetails = await userAdmin.findById(userId);
		}else if(user == "CustomerUser"){
			userDetails = await CustomerUser.findById(userId);
		}else if(user == "clientUser"){
			userDetails = await clientUser.findById(userId);
		}
		if (!userDetails){
			res.status(401).json({
				status:401,
				message:"UnAuthorized"
			});
		}

		const validated = userDetails.isValidated(req.body.password);
		if (validated){
			next();
		}
		if (!userDetails){
			res.status(401).json({
				status:401,
				message:"UnAuthorized"
			});
		}
	}catch(error){
		next(error);
	}
};