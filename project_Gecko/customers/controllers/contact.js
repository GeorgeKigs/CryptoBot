const Contacts = require("../models/contact");
const { sendMail } = require("../../utils/utils");



exports.postContacts = async (req,res,next) =>{
	// validate the input data
	try {
		const body = req.body;
		const message = {
			from: `${body.name} ${body.email}`,
			message: body.content,
		};
		const mail = await sendMail(message);
		if (!mail){
			res.status(500).json({
				status:500,
				message:"server error"
			});
		}
		await Contacts.create(body);
		res.status(200).json({
			success:true,
			message:"email sent"
		});
		
	}catch (error){
		next(error);
	}

};
