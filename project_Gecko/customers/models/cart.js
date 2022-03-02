const mongoose = require("mongoose");
const products = require("../../clients/models/products");

/**
 * check on the videos on carts
 */



const cartSchema = mongoose.Schema({
	clientId:{
		type:mongoose.Types.ObjectId,
		ref:"customerUsers",
		index:{
			unique:true,
		}
	},
	products:[{
		productId:{
			type:mongoose.Types.ObjectId,
			ref:"products"
		},
		quantity:{
			type:Number,
			default:1,
			min:1
		}
	}],
	total:{
		type:Number,
		default:0
	},
	paid:{
		type:Boolean,
		default:false
	},
	transactionId:{
		type:mongoose.Types.ObjectId,
		default:null,
		required:false
	}


},{
	collection:"cart",
	timestamps:true,
});

cartSchema.index({createdAt:1},{expireAfterSeconds:30*24*60*60});

cartSchema.methods.getCartTransaction = async (clientId)=>{
	const cart = await this.findOne(clientId);
	cart.total = 0;
	cart.products.forEach(async (product) =>{
		const price = await products.findById(product.productId).select("price");
		cart.total += price * product.quantity;
	});
	return cart;
};

cartSchema.pre("save",async (next)=>{
	this.paid = false;
	this.transactionId = null;
	next();
});

cartSchema.methods.addToCart = async (clientId,data) =>{
	return this.findOneAndUpdate({clientId},
		{$push:{
			products:{
				productId:data.productId,
				quantity:data.quantity
			}}}
	);
	
};

cartSchema.methods.removeCart = async (clientId,data) =>{
	
	return this.findOneAndUpdate(clientId,
		{$pull:{
			products:{
				productId:data.productId
			}
		}}
	);
	
};


cartSchema.methods.addQuantityCart = async (clientId,productId) =>{
	
	return this.findOneAndUpdate(
		{
			clientId,
			"products.productId":productId
		},{
			$inc:{
				"products.$.quantity":1
			}
		});

		
};

cartSchema.methods.removeQuantityCart = async (clientId,productId) =>{
	
	return this.findOneAndUpdate(
		{
			clientId,
			"products.productId":productId
		},{
			$inc:{
				"products.$.quantity":-1
			}
		});

};

cartSchema.methods.isTransactionComplete = async (clientId) =>{
	const transaction =  this.findOne({clientId})
		.select({transactionId:1,paid:1});
	if (transaction.transactionId && transaction.paid){
		return true;
	}
	return false;
};


module.exports = mongoose.model("cartSchema",cartSchema);