const mpesaTrans = require("../models/mpesaTrans");
const { getMpesaData, getTimeStamp } = require("../utils/mpesa");

/**
 * accountBalance for mpesa clients
 * @param {string} req 
 * @param res
 * @param next
 * 
*/
exports.stkPush = async (req,res,next) =>{
	try {
		const auth = "Bearer "+ req.access_token;
		const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
		const shortCode = `${process.env.MPESA_SHORTCODE}`;
		const timestamp = getTimeStamp();
		const password = new Buffer.from(shortCode + "" + timestamp).toString("base-64");
		const headers = {
			"Authorization": auth
		};
		const data = {
			"BusinessShortCode": shortCode,
			"Password": password,
			"Timestamp": timestamp,
			"TransactionType": "CustomerPayBillOnline",
			"Amount": "1",
			"PartyA": `${req.body.PhoneNumber}`,
			"PartyB": shortCode,
			"PhoneNumber": `${req.body.PhoneNumber}`,
			"CallBackURL": "https://us-central1-ohnestpos-db448.cloudfunctions.net/app/sandbox/safcallback",
			"AccountReference": "123TEST",
			"TransactionDesc": " Transaction "
		};
		const response = await getMpesaData(url,headers,data);
		console.log(response);

	} catch (error) {
		next(error);
	}
};

exports.callback = async (req,res,next) =>{
	try {
		console.log("it works");
	} catch (error) {
		next(error);
	}
};


/**
 * Send Money to the individuals using sendMoney details
 * 
 * @param Initiator the person starting the transaction
 * @param SecurityCredential hashed password from public key generated
 * @param partyA paybill making the transaction receiving the payment 
 * @param PartyB  group receiving the money
 * @query remarks the product being sold
 */

// check the api calls for B2C transactions
exports.B2C = async (req,res,next) =>{
	try {
		const auth = "Bearer "+ req.access_token;
		const url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
        
		const headers = {
			"Authorization": auth
		};
		const data = {
			"InitiatorName": " ",
			"SecurityCredential":" ",
			"CommandID": " ",
			"Amount": " ",
			"PartyA": " ",
			"PartyB": " ",
			"Remarks": " ",
			"QueueTimeOutURL": "http://your_timeout_url",
			"ResultURL": "http://your_result_url",
			"Occasion": " "
		};

		const response = await getMpesaData(url,headers,data);
		console.log(response);
	} catch (error) {
		next(error);
	}
};

/**
 * parse the data we get from the mpesa api
 */
exports.results = async (req,res,next) =>{
	try {
		console.log("received");
	} catch (error) {
		next(error);
	}
};

/**
 * marks a transaction incomplete
 * call from the mpesa api
 */
exports.timeout = async (req,res,next) =>{
	try {
		console.log(req.body);
	} catch (error) {
		next(error);
	}
};
