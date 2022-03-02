const mongoose = require("mongoose");


const mpesaTransactionSchema = new mongoose.Schema({
	TransactionType:{
		type:String
	},
	TransID:{       
		type:String,
		required:true
	},
	TransTime:{
		type:Date,
		required:true
	},
	TransAmount:{
		type:Number,
		required:true
	},
	BusinessShortCode:{
		type:Number,
		required:true
	},
	BillRefNumber:{
		type:mongoose.Types.ObjectId,
		required:true,
		ref:"products"
	},
	InvoiceNumber:{
		type:String
	},
	OrgAccountBalance:{
		type:Number
	},
	ThirdPartyTransID:{
		type:String
	},
	MSISDN:{
		type:Number,
		required:true
	},
	FirstName:{
		type:String,
		required:true
	},
	MiddleName:{
		type:String
	},
	LastName:{
		type:String
	}
},{
	timestamps:true,
});


mpesaTransactionSchema.pre("save",async (next)=>{
	this.TransAmount = parseInt(this.TransAmount);
	this.MSISDN = parseInt(this.MSISDN);
	this.BusinessShortCode = parseInt(this.BusinessShortCode);
	this.OrgAccountBalance = parseFloat(this.OrgAccountBalance);
	next();
});

module.exports = mongoose.model("mpesaTransactionModel",mpesaTransactionSchema);