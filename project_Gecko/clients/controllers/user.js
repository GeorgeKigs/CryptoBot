const User = require("../models/user");
const { authorization, sendMail } = require("../../utils/utils");

const bcryptjs = require("bcryptjs");


exports.getUsers = async (req,res,next) =>{
	try {
		
		const user = await User.findOne({
			id:req.token.userId
		}).select({
			password:-1,
			lastLogin:-1
		});
		
		if(!user){
			res.status(500).json({
				status:500,
				message:"server error"
			});
		}
		res.status(200).json({
			success:true,
			data:JSON.stringify(user)
		});
	} catch (error) {
		next(error);
	}
};

exports.editUsers = async (req,res,next) =>{
	// add authentication in the code, middleware if possible

	try {
		let body = req.body;
		await authorization(req.user,User,res);
		
		const editUser = await User.findOneAndUpdate(
			{id:req.token.userId},
			{$set:{body}},
			{new:true})
			.select({
				password:-1,
				lastLogin:-1
			});
		
		if (!editUser){
			res.status(500).json({
				status:500,
				message:"server error"
			});
		}
		res.status(200).json({
			success:true,
			data:JSON.stringify(editUser)
		});
		
	} catch (error) {
		next(error);
	}
};



exports.deleteUsers = async (req,res,next) =>{
	// authentication required
	try {
		
		const user = User.findOneAndDelete({id:req.token.userId});
		if (!user){
			res.status(500).json({
				status:40,
				message:"User not found"
			});
		}
		let message = {
			to:user.email,
			subject:"Account has been deleted.",
			text:`Dear ${user.firstName} your account has been deleted.`
		};
		sendMail(message);
		res.status(200).json({
			success:true,
			error:"user not found"
		});
		
	} catch (error) {
		next(error);
	}
};


exports.changePassword = async (req,res,next) =>{
	// authentication required
	try {
		
		const salt = bcryptjs.genSaltSync(12);
		const hash = await bcryptjs.hash(req.body.password,salt);
		const user = User.findByIdAndUpdate(req.token.userId,{
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