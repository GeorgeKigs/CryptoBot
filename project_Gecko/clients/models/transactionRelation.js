const mongoose = require("mongoose");
const wishlist = require("../../customers/models/wishlist");

// used 
const transactionSchema = mongoose.Schema({

	modePayment:{
		type:mongoose.Types.ObjectId,
		ref:"paymentSchema"
	},
	transactionId:{
		//get the transaction Id either bank details or Mpesa details
		//use of discriminators 
		type:mongoose.Types.ObjectId
	},
	complete:{
		type:String,
		enum:["incomplete","complete","reversed"]
	}
});


module.exports = wishlist.discriminator("transactionRelationModel",transactionSchema);