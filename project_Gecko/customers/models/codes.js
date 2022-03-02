const mongoose = require("mongoose");


const codeRecievedSchema = mongoose.Schema({
	code:{
		type:Number,
		min:6,
		max:8
	},
	email:{
		type:String,
		maxLength:30
	}
},{
	timestamps:true,
	expires:"30m"
});

const codeModel = mongoose.model("secrets",codeRecievedSchema);
module.exports = codeModel;
