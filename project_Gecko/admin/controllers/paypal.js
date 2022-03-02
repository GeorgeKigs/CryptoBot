const paypal = require("paypal-rest-sdk");



paypal.configure({
	"mode":"sandbox",
	"client_id":process.env.PAYPAL_CLIENTID,
	"client_secret":process.env.PAYPAL_SECRET
});

exports.charge = async (req,res,next) =>{
	try {
		const createJSON = {
			intent:"sale",
			payer:{
				payment_method:"paypal"
			},
			redirect_urls:{
				return_url:"http://ipadress:port/",
				cancel_url:""
			},
			transactions:[{
				item_list:{
					items:[{
						name:"",
						sku:"",
						price:"",
						currency:"USD",
						quantity:1
					}]
				},
				amount:{
					currency:"USD",
					total:""
				},
				description:""
			}]
		};
		const payment = await paypal.payment.create(createJSON);

		for (let i = 0; i < payment.links.length; i++) {
			if (payment.links[i].rel === "approval_url"){
				res.redirect(payment.links[i].href);
			}
            
		}
        
	} catch (error) {
		next(error);
	}
};

exports.success = async (req,res,next) =>{
	try{
		const payerId = req.query.payerID;
		const paymentId = req.query.paymentID;

		const execute_payment_json = {
			payer_id:payerId,
			transactions:[{
				amount:{
					currency:"USD",
					total:""
				},
			}]
		};
		const execute = await paypal.payment.execute(paymentId,execute_payment_json);
		console.log(execute);
	}catch(error){
		next(error);
	}
};


// exports.failure = async (req,res,next) =>{
// 	try{

// 	}catch(error){
// 		next(error);
// 	}
// };