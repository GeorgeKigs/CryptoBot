
const { sendMail } = require("../../utils/utils");
const reviews = require("../models/reviews");


exports.getSingleProductReview = async (req,res,next)=>{
	try {
		const productId = req.body.id;
		const reviewsData = await reviews.find({productId}).
			populate({
				path:"customerModel",
				select:"fistName lastName _id"
			}); 
		if (reviewsData === null){
			res.status(500).json({
				status:404,
				message:"cannot find data"
			});
		}
		res.status(200).json({
			success:true,
			data:reviewsData
		});
	} catch (error) {
		next(error);
	}
};

exports.emailReviewReply = async (req,res,next) =>{
	try {
		const body = req.body;

		const customer = await reviews.findOne({
			clientId:body.customerId,
			productId:body.productId
		}).populate({
			path:"customerModel",
			select:"email"
		});
			
		if (customer === null){
			res.status(404).json({
				status:404,
				message:"Review not found"
			});
		}
		const data = await reviews.updateOne({id:body.id},
			{
				$push:{replies:body.message}
			},{new:true});

		sendMail({
			to:`${customer.clientId.email}`,
			subject:"reply to your product review",
			plain:`here is the reply to your message: \n ${body.message}`,
		});

		res.status(200).json({
			success:true,
			data:data
		});
	} catch (error) {
		next(error);
	}
};
// send the request for review of a product