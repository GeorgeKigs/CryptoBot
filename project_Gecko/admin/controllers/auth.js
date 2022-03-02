const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const CustomerUser = require("../../customers/models/user");
const clientUser = require("../../clients/models/user");
const userAdmin = require("../models/users");
const genCode = require("../../customers/models/codes");

const { sendMail, hashPassword, generateTokenPayload, getModel, generateCode } = require("../../utils/utils");


exports.login = async (req,res,next) =>{
	try {
		const body = req.body;
		// validate the password and email or phone number
        
		let user = await getModel(req.originalUrl);
		let userDetails;
		if (user == "userAdmin"){
			userDetails = await userAdmin.findOne({email:body.email});
		}else if(user == "CustomerUser"){
			userDetails = await CustomerUser.findOne({email:body.email});
		}else if(user == "clientUser"){
			userDetails = await clientUser.findOne({email:body.email});
		}

		
		
		if (!userDetails){
			res.status(401).json({
				status:401,
				message:"UnAuthorized"
			});
		}
		

		const validate = userDetails.isValidated(body.password);

		if (!validate){
			res.status(403).json({
				status:403,
				message:"Enter the right credentials"
			});
		}

		const payload={
			userId : userDetails.id,
			email : userDetails.email,
		};
		const jwtToken = await jwt.sign(
			payload,
			process.env.SECRETORKEY,
			{expiresIn:"30min"}
		);
		res.json({
			success:true,
			token: "Bearer "+jwtToken
		});


	} catch (error) {
		next(error);
	}
    

};

exports.confirmCode = async (req,res)=>{
	try {
		const code = req.body.code;
		const storeCode = await genCode.findOne({email:req.body.email});
		if ( code === storeCode){
			res.status(200).json({
				success:true,
				message:"code verified"
			});
		} 
		res.status(403).json({
			error:{
				message:"wrong code.",
				status:403
			}
		});
	} catch (error) {
		res.status(403).json({
			error:{
				message:"wrong code.",
				status:403
			}
		});
	}
};

exports.registration = async (req,res,next) =>{
	try {
		//send mail to confirm
		const body = req.body;
		console.log(body);
		// code or url: Biomdo
		// 	
		// let user = await getModel(req.originalUrl);
		// let userDetails;
		// // if (user == "userAdmin"){
		// 	res.status(401).json({
		// 		status:401,
		// 		message:"UnAuthorized"
		// 	});
		// }else if(user == "CustomerUser"){
		// 	userDetails = await CustomerUser.create({email:body.email,password:body.password});
		// }else if(user == "clientUser"){
		// 	userDetails = await clientUser.create({email:body.email,password:body.password});
		// }
		// if (!userDetails){
		// 	res.status(401).json({
		// 		status:401,
		// 		message:"UnAuthorized"
		// 	});
		// }
		
		// const payload = {
		// 	username:`${body.firstName + body.lastName}`,
		// 	data:body
		// };
		// const token = jwt.sign(
		// 	payload,
		// 	process.env.SECRETORKEY,
		// 	{expiresIn: "30mins"}
		// );
		const token = await generateCode();

		// sendMail({
		// 	to:body.email,
		// 	subject:"Email verification",
		// 	html:`<p>dear ${body.firstName} your account has been added \n
        //     send {token} to the code`,
            
		// });
		res.status(200).json({
			message:"email sent, user registered",
			success:true,
			token
		});
        
	} catch (error) {
		next(error);
	}
};

// can be exported....
exports.forgotPassword = async (req,res,next) =>{
	try {
		const email = req.body.email;
		// send mail to confirm
		

		const token = jwt.sign(
			payload,
			process.env.SECRETORKEY,
			{expiresIn: "30mins"}
		);
		let user = await getModel(req.originalUrl);
		let userDetails;
		if (user == "userAdmin"){
			userDetails = await userAdmin.findOne({email:email});
		}else if(user == "CustomerUser"){
			userDetails = await CustomerUser.findOne({email:email});
		}else if(user == "clientUser"){
			userDetails = await clientUser.findOne({email:email});
		}
		if (!userDetails){
			res.status(401).json({
				status:401,
				message:"UnAuthorized"
			});
		}
		const payload = {
			email,
			userId:userDetails.id
		};
		sendMail({
			to:"email",
			subject:"Forgot Password",
			html:`dear ${userDetails.firstName} your account has been added \n
            click <a href = ${req.url+"/?token="+token}>here</a> to this link to verify your account`,
		});
		res.status(200).json({
			success:true,
			message:"email sent"
		});
	} catch (error) {
		next(error);
	}
};

// how to handle the next(error)
// can be exported....
exports.changePassword = async (req,res,next)=>{
	/**
	 * requires to be authenticated and in the system
	 * 
	 */
	try {
		const salt = bcryptjs.genSaltSync(12);
		const hash = await bcryptjs.hash(req.body.password,salt);
		const user = userAdmin.findByIdAndUpdate(req.token.userId,{
			$set:{
				password:hash
			}
		});
		// send mail to confirm
		let message = {
			to:user.email,
			subject:"Password has been changed",
			text:`Dear ${user.firstName} your password has been changed.`
		};
		sendMail(message);
		res.status(200).json({
			success:true,
		});
	} catch (error) {
		next(error);
	}
};


exports.confirmEmail = async (req,res,next)=>{
	try {
		const token = req.query.token;
		const payload = await generateTokenPayload(token,res);
		let body = payload;

		let user = await getModel(req.originalUrl);
		let userDetails;
		if (user == "userAdmin"){
			userDetails = await userAdmin.findOne({email:body.email});
		}else if(user == "CustomerUser"){
			userDetails = await CustomerUser.findOne({email:body.email});
		}else if(user == "clientUser"){
			userDetails = await clientUser.findOne({email:body.email});
		}
		if (!userDetails){
			res.status(401).json({
				status:401,
				message:"UnAuthorized"
			});
		}
		res.status(200).json({
			success:true,
			message:"password has been changed"
		});
	} catch (error) {
		next(error); 
	}
};

exports.confirmPasswordEmail = async (req,res,next)=>{
	try {
        
		const payload = await generateTokenPayload(req.query.token,res);
		const body = req.body;

		const hash = hashPassword(body.password);

		const user = getModel(req.url);
		const userData = await user.findOneAndUpdate({email:payload.email},{
			$set:{password:hash}
		},{new:true});
		if (userData === null){
			res.status(403).json({
				status:403,
				message:"Enter the right credentials"
			});
		}
		res.status(200).json({
			success:true,
			message:"password has been changed",
		});
        
	} catch (error) {
		next(error); 
	}
    

};

// exports.failure = (req,res,next)=>{
// 	res.send(404).json({
// 		success:false,
// 		error:"Authentication error"
// 	});
// };

