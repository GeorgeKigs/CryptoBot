
const store = require("../models/Store");


// verify store owner using the userId in the model and the one in the tokes

exports.getStores = async (req,res,next) =>{
	try {
		let stores = await store.find();

		res.status(200).json({
			success:true,
			count:stores.length,
			data:stores
		});
	} catch (error) {
		next(error);
	}
};

exports.getUserStores = async (req,res,next) =>{
	try {
		let user = req.token.UserId;
		let stores = await store.find({
			UserId:user
		});

		res.status(200).json({
			success:true,
			count:stores.length,
			data:stores
		});
	} catch (error) {
		next(error);
	}
};

exports.getSingleStore = async (req,res,next) =>{
	try {
		const storeId = req.body.storeId;
		let singleStore = await store.
			findById({
				id:storeId,
				UserId:req.token.UserId
			}).
			select("-PaymentOptions");
		if (singleStore == null){
			res.status(404).json({
				status:404,
				message:"Store not found"
			});
		}
			
		res.status(200).json({
			success:true,
			data:JSON.stringify(singleStore)
		});
		
	} catch (error) {
		next(500);
	}
};

exports.addStore = async (req,res,next)=>{
	try {
		// validate the data ensure bank details are safe
		const body = req.body;
		body.image = req.file.filename;
		body.UserId = req.token.UserId;
		const stores = await store.create(body);

		res.status(200).json({
			success:true,
			data:stores
		});
	} catch (error) {
		next(error);
	}
	
};

exports.editStore = async (req,res,next)=>{
	try {
		// check for bank details in the response sent
		const stores = await store.findOneAndUpdate({
			owner:req.token.UserId,
			id:req.body.storeId
		},
		{$set:req.body},
		{new:true}
		);

		res.status(200).json({
			success:true,
			data:stores
		});
	} catch (error) {
		next(error);
	}

};

exports.deleteStore = async (req,res,next)=>{
	try {
		
		let stores = await store.deleteOne({
			id:req.body.storeId,
			UserId:req.token.UserId
		});
		res.status(200).json({
			success:true,
			message:"delete account"
		});
	} catch (error) {
		next(error);
	}
};

