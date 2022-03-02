const mongoose = require("mongoose");

const PaymentSystemSchema = new mongoose.Schema({
	storeId:{
		type:mongoose.Types.ObjectId,
		ref:"Store"
	},
	userId:{
		type:mongoose.Types.ObjectId,
		ref:"CustomerUsers"
	},
	createdAt:{
		type:Date,
		default:Date.now()
	},
	Mpesa:[{
		type:{
			type:String,
			enum:["PayBill","BuyGoods","sendMoney"]
		},
		TransNo:{
			type:Number,
			required: ()=>{
				if(this.Mpesa.type.length == 0){
					return false;
				}
				return true;
			}
		}
	}],
	Bank:[{
		type:{
			type:String,
		},
		accountNumber:{
			type:Number,
			required: ()=>{
				if(this.Bank.type.length == 0){
					return false;
				}
				return true;
			}
		}
	}]
},{
	timestamps:true
});

// add encryption before saving
// monitor changes made to the db at the created at value

module.exports = mongoose.model("paymentSchema",PaymentSystemSchema);