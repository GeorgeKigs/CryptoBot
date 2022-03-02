const mongoose = require("mongoose");
// const users = require("../../admin/models/users");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const options = {
	timestamps:true,
	collection:"customerUsers",
};

/**
 * model to store all the users information in one model
 */


const CustomerSchema = mongoose.Schema({
	firstName:{
		type:String,
		required:true,
		trim:true,
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
		required:true,
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
	facebookId:{
		type:String
	},
	googleId:{
		type:String
	},
	address1:{
		type:String,
		validate : {
			validator: (data) => {
				return validator.isEmail(data);
			},
			message:"Enter a correct email address"
		}
	},
	address2:{
		type:String,
		validate :{
			validator: (address) =>{
				return validator.isAlpha(address);
			}
		}
	},
	lastLogin:{
		type:Date,
		default:Date.now
	},
	verified:{
		type:Boolean,
		default:false
	}
},
options
);

CustomerSchema.pre("save", async (next) =>{
	const user = this;
	const salt = bcryptjs.genSaltSync(12);
	const hash = await bcryptjs.hash(this.password,salt);
	user.password = hash;
	next();
});

CustomerSchema.statics.findByEmail = async (email)=>{
	const data = userDb.findOne({email});
	return data;
};

CustomerSchema.methods.isValidated = async (password) => {
	const user = this;
	const valid = await bcryptjs.compare(password,user.password);
	return valid;
};

// change the name of the models to clientUser
const userDb = mongoose.model("clientsUsers",CustomerSchema);

module.exports = userDb;
