const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
	storeId:{
		type:mongoose.Types.ObjectId,
		ref:"StoreSchema"
	},
	productName:{
		type:String,
		required:true,
		index:true,
		maxlength:200,
	},
	categories:{
		// add different categories that suite the store.
		type:String,
		index:true,
		enum:[]
	},
	price:{
		type:Number,
		index:true,
		required:()=>{
			if (this.attributes.length === 0){
				return true;
			}
			return false;
		},
	},
	rating:{
		type:Number,
		enum:[0,1,2,3,4,5],
		default:()=>{
			return Math.ceil(Math.random()*(5-2)+2);
		}
	},
	quantity:{
		type:Number,
		required:true
	},
	description:{
		type:String,
		lowercase:true,
	},
	images:[{
		type:String
	}],
	variety:{
		type:Boolean,
		default:()=>{
			if (this.attributes.length === 0){
				return true;
			}
			return false;
		}
	},
	views:{
		type:Number
	},
    
	attributes:[{
		characteristic:{
			type:String,
			index:true,
			
		},
		value:[{
			type:String,
			maxlength:20,
		}],
		price:{
			type:Number,
			max:1000000,
			min:1, 
		},
		// quantity:{
		// 	type:Number,
		// 	min: () =>{
		// 		if (this.quantity === null){
		// 			return 1;
		// 		}
		// 		return null;
		// 	}
		// }
	}]
});


module.exports = mongoose.model("products",productSchema);