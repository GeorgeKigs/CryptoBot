const node_geocoder = require("node-geocoder");
const nodemailer = require("nodemailer");
const multer = require("multer");
// const passport = require("passport");
const jwt = require("jsonwebtoken");
const random = require("generate-password");
const { defineError } = require("./errorHandling");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");


dotenv.config({
	path:path.join(__dirname,"../config/config.env")
});

exports.geocoder = async () =>{
	const geocoderOptions = {
		provider : process.env.GEOCODER,
		httpAdapter:"",
		apiKey:process.env.GEOCODER_APIKEY,
		formatter:null
	};
	node_geocoder(geocoderOptions);
};

// exports.authentication = async (req,res,next) =>{
// 	// Ask Biomodo
// 	passport.authenticate(["localStrategy","GoogleStrategy","FacebookStrategy"]);
// 	if (req.isAuthenticated()){
// 		next();
// 	}else{
// 		res.status(403).json({
// 			success:false,
// 			data:"user unauthorized"
// 		});
// 	}
    
// }; 
exports.uploadProductPhotos = function() {
	var storage = multer.diskStorage({
		destination: (req,file,cb) =>{
			cb(null,"../static/productPics");
		},
		filename: (req,file,cb) =>{
			cb(null,file.filename + "-" + Date.now());
		}
	});
	var fileFilter = (req,file,cb) => {
		if (
			file.mimietype !== "/image/png" ||
            file.mimietype !== "/image/jpg" ||
            file.mimietype !== "/image/jpeg" 
		){
			return cb(null,false);
		}
		cb(null,true);
	};
	const limits ={
		fileSize:"1MB"
	};

	return multer({
		storage:storage,
		fileFilter:fileFilter,
		limits:limits
        
	}).array("productPhotos",4);
};
exports.uploadPhotos = function (){
	var storage = multer.diskStorage({
		destination: (req,file,cb) =>{
			cb(null,"../static/productPics");
		},
		filename: (req,file,cb) =>{
			cb(null,file.filename + "-" + Date.now());
		}
	});
	var fileFilter = (req,file,cb) => {
		if (
			file.mimietype !== "/image/png" ||
            file.mimietype !== "/image/jpg" ||
            file.mimietype !== "/image/jpeg" 
		){
			return cb(null,false);
		}
		cb(null,true);
	};
	const limits ={
		fileSize:"2MB"
	};

	return multer({
		storage:storage,
		fileFilter:fileFilter,
		limits:limits
        
	}).array("storePhotos",5);
};



exports.sendMail = async (message) =>{
	const transOptions = {
		host:process.env.MAIL_HOST,
		port:process.env.MAIL_PORT,
		secure:false,
		auth:{
			user:process.env.AUTH_USER,
			pass:process.env.AUTH_PASS
		}
	};
	message.from = `"gecko company" ${process.env.AUTH_USER}`;
    
	if (!message.type){
		message.type = "text/plain";
	}
	try {
        
		let transporter = await nodemailer.createTransport(transOptions);
		transporter.sendMail(message);
        
		return true;
        
	} catch (error) {
		return error; 
	}
    
};

exports.generateCode = async () =>{
	const passwordOptions = {
		numbers:true,
		length:8
	};
	return random.generate(passwordOptions);
};

exports.generateTokenPayload = async function (token){
	try{

		const payload = jwt.verify(token, process.env.SECRETORKEY);
		return payload;
        
	}catch (error){
		// eslint-disable-next-line quotes
		defineError(`Cannot decode token error ${error}`,500);
	}
};

exports.hashPassword  = async (plain,res)=>{
	try {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(plain,salt);
		return hash;
	} catch (error) {
		res.status(500).json({
			success:false,
			error:error
		});
	}
    
};

exports.getModel = async (url) =>{
    
	const urlParameter = url.split("/").reverse()[2];
	
	switch (urlParameter) {
	case "admin":
		return "AdminUsers";
	case "client":
		return "clientUser";
	default:
		return "CustomerUser";
	}
};