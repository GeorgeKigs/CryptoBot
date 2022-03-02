const mongoose = require("mongoose");
const { geocoder } = require("../../utils/utils");
const payment = require("./payment");
const products = require("./products");

/** 
 * Store module for the clients store.
 * Holds information about the store, general details and the also the bank details
 */


const StoreSchema = new mongoose.Schema({
	
	storeName:{
		type:String,
		required:true,
		unique:true
	},
	address:{
		type:String,
		required:true, 
	},
	userId:{
		type:mongoose.Types.ObjectId,
		ref:"clientUsers",
		required:true
	},
	images:[{
		type:String,
		required:true
	}],
	description:{
		type:String
	},
	location:{
		type:{
			type:String,
			enum:["Point"],
			required:true
		},
		coordinates: {
			type:Number,
			index:"2dsphere",
			required:true
		},
		formattedAddress:{
			type:String
		}
	},
	
	createdAt:{
		type:Date,
		default:Date.now
	}
},{
	timestamps:true
}); 


StoreSchema.pre("save",async (next)=>{
	const loc = await geocoder.geocode(this.address);
	this.location = {
		type:"Point",
		coordinates:[loc[0].longitude,loc[0].latitude],
		formattedAddress:loc[0].formattedAddress
	},
	this.address = undefined;
	next();
});

// StoreSchema.pre('save', async (next)=>{
//     const up
//     next()
// });

StoreSchema.pre("remove",async (next) =>{
	products.remove({storeId:this._id}).exec();
	payment.remove({storeId:this._id}).exec();
	next();
});

const store = mongoose.model("Store",StoreSchema);
module.exports = store;