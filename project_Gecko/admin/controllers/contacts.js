const contact = require("../../customers/models/contact");

const { sendMail } = require("../../utils/utils");

// pagination of the results
exports.getMail = async (req,res,next) =>{
	try {
		const getContact = await contact.find();
		if (getContact === null){
			res.status(500).json({
				status:40,
				message:"Server Error"
			});
		}
		res.status(200).json({
			success:true,
			data:getContact
		});
	} catch (error) {
		next(error);
	}
};

exports.getSingleMail = async (req,res,next) =>{
	try {
		const body = req.body;
		const getContact = await contact.findById(body.id);
		if (getContact === null){
			res.status(500).json({
				status:40,
				message:"Server Error"
			});
		} 
		res.status(200).json({
			success:true,
			data:getContact
		});
	} catch (error) {
		next(error);  
	}

};

exports.sendBulkMail = async (req,res,next)=>{
	try {
		const body = req.body;
		const emails = [body.email.split(",")];
		emails.forEach((email)=>{
			sendMail({
				to:`${email}`,
				subject:"reply to your contact details",
				plain:`Dear: Customer, \n ${body.message}`,
			});
		});
        
		res.status(200).json({
			success:true,
			message:"emails are being sent"
		});
	} catch (error) {
		next(error);
	}

}; 

exports.sendReplyEmail = async (req,res,next) =>{
	try {

		const body = req.body;
        
		sendMail({
			to:`${body.email}`,
			subject:"reply to your contact details",
			plain:`Dear:${body.user}, \n ${body.message}`,
		});
		const getContact = await contact.findByIdAndUpdate(body.id,{$push:{replies:body.content}},{new:true});
		if (getContact === null){
			res.status(500).json({
				status:40,
				message:"Server Error"
			});
		}
		res.status(200).json({
			success:true,
			data:getContact
		});
	} catch (error) {
		next(error);
	}

};