const products = require("../../clients/models/products");
const Store = require("../../clients/models/Store");


exports.getAllProducts = async (req,res,next) =>{
	try {
		let count = await products.find({quantity:{$gt:0}});
		count = count.length;
		let start = 0;
		if (req.query.page){
			let start = req.query.page*24;
			if (start > count) {
				start = count;
			}
		}
		
		const pages = Math.ceil(count/24);
		let Product = await products
			.find({})
			.limit(24)
			.skip(start)
			.select({
				price:1,
				productName:1,
				rating:1,
				images:1
			});
		
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

exports.getProductCategory = async (req,res,next)=>{
	try {
		let count = await products.find({views:{$gt:0}});
		count = count.length;
		let start = req.query.page*24;
		if (start > count) {
			start = count;
		}
		let term = req.query.category | req.query.category;
		const pages = Math.ceil(count/24);
		let Product = await products
			.find({
				categories:term
			})
			.limit(24)
			.skip(start)
			.select({
				price:1,
				productName:1,
				rating:1,
				images:1
			});
		
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

exports.getNearbyProducts = async (req,res,next) =>{
	try {
		const coords = req.body.coordinates;
		// calculate the coordinates using the given coords
		// search within a range
		const stores = await Store.find().select("id");
		let productList = [];
		//products
		stores.forEach((store)=>{
			let product = products.find({
				StoreId:store,
				views:{$gt:0}
			}).select({
				price:1,
				productName:1,
				rating:1,
				images:1
			}).sort({
				views:1,
				rating:1,
				price:-1
			}).limit(10);
			product.forEach(item =>{
				productList.concat(item);
			});
			
		});

		res.status(200).json({
			coords,
			data:productList,
			success:true,
			count:products.length
		});
	} catch (error) {
		next(error);
	}
	

};

//get the max time from a collection of data.