const { generateTokenPayload } = require("../../utils/utils");
const wishlist = require("../models/wishlist");

exports.getwishList = async(req,res,next) =>{
	try {
		const token = req.token;
		const payload  = generateTokenPayload(token);
		const list = wishlist.findOne({clientId:payload.user});
		req.status(200).json({
			products:list.products
		});
	} catch (error) {
		next(error);
	}
	

};

exports.postWishList = async (req,res,next) =>{
	try {
		const token = req.token;
		const payload = generateTokenPayload(token);
		const wishListCreated = new wishlist.findByIdAndUpdate(
			{clientId:payload.user},
			{
				$push:{"products":{
					quantity:req.body.quantity,
					productId:req.body.productId
				}
				},
			},
			{
				upsert:true,
				safe:true
			}
		);
		res.status(200).json({
			data:wishListCreated.products
		});
	} catch (error) {
		next(error);
	}
};