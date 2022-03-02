const mongoose = require("mongoose");
const products = require("./products");
const store =  require("../models/Store");
const payment =  require("../models/payment");
const bcryptjs = require("bcryptjs");
const wishlist = require("../../customers/models/wishlist");


const clientSchema = mongoose.Schema({
	firstName:{
		type:String,
		trim:true,
		required:true,
		maxlength:20,
	},
	lastName:{
		type:String,
		trim:true,
		required:true,
		maxlength:20,
	},
	email:{
		type:String,
		index:{
			unique:true,
		},
		trim:true,
		tolowercase:true,
	},
	password:{
		type:String,
		required:true,
		minlength:8,
	},
	phoneNumber:{
		type:Number,
		required:true,
		unique:true,
		minlength:8,
		maxlength:10,
	},
	lastLogin:{
		type:Date,
		default:Date.now()
	}
},{
	timestamps:true,
});



clientSchema.pre("save", async (next) =>{
	const user = this;
	const salt = bcryptjs.genSaltSync(12);
	const hash = await bcryptjs.hash(this.password,salt);
	user.password = hash;
	next();
});

clientSchema.statics.findByEmail = async (email)=>{
	const data = userDb.findOne({email});
	return data;
};

clientSchema.methods.isValidated = async (password) => {
	const user = this;
	const valid = await bcryptjs.compare(password,user.password);
	return valid;
};
clientSchema.pre("remove", async (next)=>{
	const storeId = await store.findOne({owner:this._id}).select("_id");
	products.deleteMany({storeId:storeId}).exec();
	payment.deleteMany({storeId:storeId}).exec();
	wishlist.deleteMany({storeId});
	store.remove({owner:this._id}).exec();
	next();
});
// change the name of the models to clientUser
const userDb = mongoose.model("clientUsers",clientSchema);
module.exports = userDb;