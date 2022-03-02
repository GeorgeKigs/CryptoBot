const customers = require("../../customers/models/user");
const client = require("../../clients/models/user");
const stores = require("../../clients/models/Store");



exports.getAllStores = async(req,res,next)=>{
	try {
		const count = await (await stores.find({})).length;
		
		let start = req.query.page*24;
		if (start > count) {
			start = count;
		}

		const pages = Math.ceil(count/24);
		let Product = await stores
			.find({})
			.limit(24)
			.skip(start)
			.select({
				images:-1
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

exports.getAllCustomers = async (req,res,next)=>{
	try {
		const count = (await client.find({})).length;
		
		let start = req.query.page*24;
		if (start > count) {
			start = count;
		}

		const pages = Math.ceil(count/24);
		let Product = await client
			.find({})
			.limit(24)
			.skip(start)
			.select({
				password:-1
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

exports.getAllClients = async (req,res,next)=>{
	try {
		let count = await customers.find({});
		count = count.length;
		let start = req.query.page*24;
		if (start > count) {
			start = count;
		}

		const pages = Math.ceil(count/24);
		let Product = await customers
			.find({})
			.limit(24)
			.skip(start)
			.select({
				password:-1
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