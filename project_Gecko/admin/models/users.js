const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const options ={
	timestamps:true
};

const UserBasicSchema = mongoose.Schema({
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
},
options
);



UserBasicSchema.pre("save", async (next) =>{
	const user = this;
	const salt = bcryptjs.genSaltSync(12);
	const hash = await bcryptjs.hash(this.password,salt);
	user.password = hash;
	next();
});

UserBasicSchema.statics.findByEmail = async (email)=>{
	const data = AdminDb.findOne({email});
	return data;
};

UserBasicSchema.methods.isValidated = async (password) => {
	const user = this;
	const valid = await bcryptjs.compare(password,user.password);
	return valid;
};

const AdminDb = mongoose.model("adminModel",UserBasicSchema);
module.exports = AdminDb;
