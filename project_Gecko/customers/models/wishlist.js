const mongoose = require("mongoose");

const options ={
	collection:"wishList",
	timestamps:true
};

// Parse through  the wishlist

/**
 * Contains the data that is similar to the transaction.
 *  Thus it is used as a discriminator
*/

const wishList = new mongoose.Schema({
	clientId:{
		type:mongoose.Types.ObjectId,
		ref:"customerUsers",
		index:true
	},
	storeId:{
		type:mongoose.Types.ObjectId,
		ref:"Store",
		index:true
	},
	productId:{
		type:mongoose.Types.ObjectId,
		ref:"products",
		index:true
	},
	date:{
		type:Date,
		default:Date.now()
	},
	quantity:{
		type: Number,
		min:1,
		default:1
	},
	
	
},{
	options
});

wishList.methods.addProduct = async function (user,data){
	
	return this.create({
		clientId:user,
		productId:data.productId,
		quantity:data.quantity
	});
};

wishList.methods.addQuantity = async function(clientId,productId){
	return this.findOneAndUpdate(
		{clientId,productId},
		{$inc:{
			quantity:1
		}},{
			safe:true
		}
	);
};

wishList.methods.reduceQuantity = async function (clientId,productId){
	return this.findOneAndUpdate(
		{clientId,productId},
		{$inc:{
			quantity:-1
		}},{
			safe:true
		}
	);
};

wishList.methods.deleteProduct = async function (clientId,productId){
	return this.findOneAndDelete(
		{clientId,productId}
	);
};

module.exports = mongoose.model("wishList",wishList);
