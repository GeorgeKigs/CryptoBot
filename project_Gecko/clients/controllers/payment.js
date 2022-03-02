const payment = require("../models/payment");
const { sendMail } = require("../../utils/utils");

const user = require("../models/user");

exports.getPaymentDetails = async (req,res,next) =>{
	try {
		const body = req.body;
		const user = req.user;
		const storeId = req.body.storeId;
		// get the storeId from the tokens or the owner's Id
		// check email from the populated email address
		const details = await payment.findOne({storeId}).select("-storeId -userId");
		if (details === null){
			res.status(500).json({
				status:500,
				message:"server error"
			});
		}
		res.status(200).json({
			success:true,
			data:details
		});

	} catch (error) {
		next(error);
	}
};

exports.editPaymentDetails = async (req,res,next) =>{

	try {
		const body = req.body;
		const user = req.user;
		const storeId = req.body.storeId;
		// get the storeId from the tokens

		// confirm this
		const details = await payment.findOneAndUpdate(
			{storeId},
			{$set:{body}},
			{new:true});

		
		if (details === null){
			res.status(500).json({
				status:500,
				message:"server error"
			});
		}
		res.status(200).json({
			success:true,
			message:"successfully edited data the data"
		});

		// send email details
		
		sendMail({
			to:"email",
			message:`dear ${user} your account has been edited`
		});
	} catch (error) {
		next(error);
	}
};

exports.addPaymentDetails = async (req,res,next) =>{
	try {
		const body = req.body;
		const user = req.user;
		const email = "";
		const storeId = "";
		// get the storeId from the tokens

		// confirm this
		const details = await payment.findOneAndUpdate(
			{storeId},
			{$set:{body}},
			{new:true});
		
		
		if (details === null){
			res.status(500).json({
				status:500,
				message:"server error"
			});
		}
		res.status(200).json({
			success:true,
			message:"successfully edited data the data"
		});
		//send mail
		sendMail({
			to:"email",
			message:`dear ${user} your account has been added`
		});
	} catch (error) {
		next(error);
	}
};

exports.deletePayment = async (req,res,next) =>{
	try {
		const body = req.body;
		const user = req.user;
		const storeId = req.body.storeId;
		// get the storeId from the tokens

		// confirm this
		const details = await payment.findOneAndDelete({userId:user,storeId});
		
		
		if (details === null){
			res.status(500).json({
				status:500,
				message:"server error"
			});
		}
		// send mail
		
		sendMail({
			to:"email",
			message:`dear ${user} your account has been deleted`
		});
		res.status(200).json({
			success:true,
			message:"successfully edited data the data"
		});
	} catch (error) {
		next(error);
	}
};


exports.payOrganization = async (req,res,next)=>{
	try {
		const userId = req.token.userId;
		const phone = await user.findOne({userId}).select("phoneNumber");
		req.body.phoneNumber = phone;
		next();
	} catch (error) {
		next(error);
	}
};

