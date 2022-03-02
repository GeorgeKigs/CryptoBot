const axios = require("axios").default;


/**
 * simulation for mpesa transactions.
 * simulate c2b transactions
 * and reversal of transaction. Acts as a middleware for the mpesa routes
 */
exports.getAccessToken = async (req,res,next) =>{
	try {
		const consumerKey = process.env.MPESA_API_KEY;
		const consumerSecret = process.env.MPESA_API_SECRET;
		const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
		
		const buffer = new Buffer.from(consumerKey + ":" + consumerSecret);
		const auth = "Basic " + buffer.toString("base64");

		const responseBody = await axios.get({
			url:url,
			headers:{
				"Authorization": auth
			},
			
		});

		req.accessToken = responseBody.data.access_token;
	} catch (error) {
		next(error);
	}
	
};

/**
 * Generates the time that is used in the mpesa API
 */
exports.getTimeStamp = async ()=>{
	const date = new Date();
	const year = date.getFullYear();
	let month = date.getMonth();
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const seconds = date.getSeconds();
	let array = [month,day,hour,minute,seconds];

	let timestamp = ""+year;

	array.forEach(function (variable) {
		if (variable.toString().length() == 2){
			timestamp += variable.toString();
		} else{
			timestamp += `0${variable.toString()}`;
		}
	});
	return timestamp;
};

/**
 * Axios post function to get the data from Mpesa API
 * @param {*url for the mpesa transaction} url mpesa url
 * @param {*authorization headers for the request} headers mpesa authorization
 * @param {*data to be sent for the mpesa transaction to complete} data to be sent
 * @returns data or error obtained
 */
exports.getMpesaData =  (url,headers,data) =>{
	const response = axios.post(url,data,
		{
			headers
		});
	if (!data.data){
		new Error("Cannot find data");
	}

	return response;
};

// /**
//  * generation of a product key file and adding it to the encrypt the data
//  */


// /**
//  * Registers the mpesa URLs that will be used for transactions
//  * @param {short code} short code for the mpesa transactions
//  * @param {confirmation Url}  confirmation url
//  * @param {validation Url} next 
//  */
//  exports.getRegisterUrls =  async (req,res,next) =>{
// 	try {
// 		const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
// 		const auth = "Bearer"+ req.access_token;
// 		const headers = { "Authorization": auth };
// 		//check on the short codes and the urls
// 		const data = {
// 			"ShortCode": "600383",
// 			"ResponseType": "Cancelled",
// 			"ConfirmationURL": "http://ip_address:port/confirmation",
// 			"ValidationURL": "http://ip_address:port/validation_url"
// 		};

// 		const response = await getMpesaData(url,headers,data);
// 		console.log(response.data);
// 	} catch (error) {
// 		next(error);
// 	}
// };


// /**
//  * Enter the data into a database from the credentials that we get 
//  * and initiate the payment to the client
//  */

// exports.paymentConfirmation = async (req,res,next) =>{
// 	try {
// 		console.log("----------------confirmation-------------");
// 		console.log(req.body);

// 		var message = {
// 			"ResultCode": 0,
// 			"ResultDesc": "Success"
// 		};
// 		const body = JSON.parse(req.body);
// 		const newTrans = new mpesaTrans.create({body},{new:true});

// 		res.status(200).json(JSON.stringify(message));

// 	} catch (error) {
// 		next(error);
// 	}
// }; 

// /**
//  * Validate the data that we are getting from Mpesa and whether to 
//  * accept the payment
//  */
// exports.paymentValidation = async (req,res,next) =>{
// 	try {
// 		console.log("----------------validation-------------");
// 		console.log(req.body);

// 		var message = {
// 			"ResultCode": 0,
// 			"ResultDesc": "Success",
// 			"ThirdPartyTransID": "1234567890"
// 		};
        
// 		res.status(200).json(JSON.stringify(message));

// 	} catch (error) {
// 		next(error);
// 	}
// };

