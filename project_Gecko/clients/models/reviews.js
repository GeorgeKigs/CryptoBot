const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
	customerId:{
		type:mongoose.Types.ObjectId,
		ref:"CustomerSchema",
		index:true
	},
	productId:{
		type:mongoose.Types.ObjectId,
		ref:"products",
		index:true
	},
	rating:{
		type:Number,
		enum:[1,2,3,4,5],
		required:true
	},
	comments:{
		type:String,
		required:true,
	},
	replies:[{
		type:String,
		tolowercase:true
	}]

});

module.exports = mongoose.model("reviewsModel",reviewSchema);