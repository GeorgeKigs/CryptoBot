const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
	clientName:{
		type: String,
		required:true,
		trim:true,
		minlength:3,
		maxlength:25
	},
	email:{
		type: String,
		required:true,
		trim:true,
		minlength:3,
		maxlength:25
	},
	content:{
		type: String,
		required:true,
		minlength:3, 
	},
	replies:[{
		type: String,
		minlength:3,
	}]
},{
	timestamps:true
});

contactSchema.index({createdAt: 1},{expireAfterSeconds: 60*60*24*3});

module.exports = mongoose.model("contactModel",contactSchema);