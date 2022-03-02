
const { authorization, generateTokenPayload } = require("../../utils/utils");
const product = require("../models/products");

exports.getProducts = async (req,res,next) =>{
	try {

		
		const storeId = await generateTokenPayload(req.headers.token).storeId;
		let count = await product.find({storeId,quantity:{$gt:0}});
		count = count.length;
		let start = req.query.page*24;
		if (start > count) {
			start = count;
		}

		const pages = Math.ceil(count/24);
		let Product = await product
			.find({storeId})
			.limit(24)
			.skip(start)
			.select("-variety");
		
		if (!Product){
			res.status(500).json({
				status:404,
				message:"cannot find product"
			});
		}

		res.status(200).json({
			success:true,
			count:Product.length,
			data:Product,
			pages:pages
		});

	} catch (error) {
		next(error);
	}
};

exports.searchProduct = async (req,res,next) =>{
	try {
		let request;
		if (req.query.searchTerm){
			request = req.query.searchTerm;
		}else if(req.body.searchTerm){
			request = req.body.searchTerm;
		}
		else{
			res.status(403);
		}
		let start = req.query.page*24;
		const data = await product
			.find({
				productName:{$regex:request},
				quantity:{$gt:0}
			})
			.select({
				productName:1,
				price:1,
				rating:1,
				attributes:1
			})
			.limit(24)
			.skip(start)
			.sort({
				rating:1,
				price:-1
			});
		const count = data.length; 
		
		if (start > count) {
			start = count;
		}

		const pages = Math.ceil(count/24);
		res.send({
			data:data,
			pages
		});
	} catch (error) {
		next(error);
	}
};

exports.getSingleProduct = async (req,res,next) =>{
	try {
		const productId = req.query.ProductId;
		let singleProduct = await product.findById(productId).select("-variety");

		if (!singleProduct){
			res.status(404).json({
				status:404,
				message:"Enter the right product"
			});
		}
		if (req.headers.token){
			const token = await generateTokenPayload(req.headers.token);
			if ( token.storeId != singleProduct.storeId){
				singleProduct.updateOne({$inc:{views:1}});
			}
		}
		
		res.status(200).json({
			success:true,
			data:JSON.stringify(singleProduct)
		});
        
	} catch (error) {
		console.log(error.message);
		next(error);
	}
};

exports.getMostViewedProduct = async (req,res,next) =>{
	try {
		let mostViewed = await product.find({views:{$gt:0}}).sort("views").limit(5);
		if (!mostViewed){
			mostViewed = await product.find({}).sort("rating").limit(5);
		}
		res.send({
			success:true,
			data:JSON.stringify(mostViewed)
		});
	} catch (error) {
		next(error);
	}
};

exports.addProduct = async (req,res,next)=>{
	try {
		await authorization(req.user,product,res);
		const body = req.body;
		body.image = req.file.filename;
		const Product = await product.create(body);

		res.status(200).json({
			success:true,
			data:Product
		});
	} catch (error) {
		next(error);
	}
    
};

exports.editProduct = async (req,res,next)=>{
	try {
		// add authentication
		await authorization(req.user,product,res);
		const Product = await product.findOneAndUpdate(
			{owner:req.user.id},
			{$set:req.body},
			{new:true}
		);

		res.status(200).json({
			success:true,
			data:Product
		});
	} catch (error) {
		next(error);
	}

};

exports.deleteProduct = async (req,res,next)=>{
	try {
		await product.deleteOne({id:req.body.id});
		res.status(200).json({
			success:true
		});
	} catch (error) {
		next(error); 
	}
};