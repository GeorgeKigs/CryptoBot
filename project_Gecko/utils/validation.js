var { body,validationResult} = require("express-validator");

exports.validateLoginReq = [
	body(["email"]).isEmail().notEmpty().normalizeEmail().withMessage("Email only"),
	body(["password"]).isLength({min:8,max:16}).withMessage("cannot be empty")
];

exports.validateRegistrationReq = [
	body(["email"]).isEmail().notEmpty().normalizeEmail().withMessage("Email only"),
	body(["firstName"]).isLength({min:2,max:16}).trim().withMessage("cannot be empty"),
	body(["lastName"]).isLength({min:2,max:16}).withMessage("cannot be empty"),
	body(["password"]).isLength({min:8,max:16}).withMessage("cannot be empty"),
	body(["phoneNumber"]).isLength({min:8,max:12}).withMessage("cannot be empty"),
];

exports.validateContacts = [
	body(["email", "content","subject","clientName"]).notEmpty().withMessage("cannot be empty"),
	body(["email"]).isEmail().normalizeEmail().withMessage("Email only"),
	body(["subject"]).isLength({max:120}).withMessage("cannot be longer"),
	body(["subject","content"]).trim().isAlphanumeric().withMessage("no special characters"),
];

exports.validateReviews = [
	body(["rating","comments"]).notEmpty().withMessage("cannot be empty"),
	body(["rating"]).isNumeric().withMessage("Email only"),
	body(["subject"]).isLength({max:120}).withMessage("cannot be longer"),
	body(["comments","replies"]).trim().isAlphanumeric().withMessage("no special characters"),
];
exports.storeValidation = [
	body(["storeName"]).notEmpty().trim().withMessage("cannot be empty"),
	body(["address"]).notEmpty().withMessage("cannot be empty"),
	body(["location"]).isLatLong().notEmpty().withMessage("Latitude longitude"),
	body(["description"]).trim().notEmpty().withMessage("Short Description"),
];
exports.valPassword = [
	body(["password"]).isLength({min:8,max:16}).withMessage("cannot be empty")
];

exports.valEmail = [
	body(["email"]).isEmail().notEmpty().normalizeEmail().withMessage("Email only")
];

exports.validateSearch = [
	body(["searchTerm"]).notEmpty().isAlpha().withMessage("Search invalid")
];

exports.validateMessage = [
	body(["message"]).notEmpty().isAlphanumeric().withMessage("Message Invalid")
];

exports.validateProducts = [
	body(["productName"]).notEmpty().trim().withMessage("cannot be empty"),
	body(["categories"]).notEmpty().withMessage("cannot be empty"),
	body(["price"]).isNumeric().notEmpty().withMessage("Integers only"),
	body(["description"]).trim().notEmpty().withMessage("Short Description"),
	body(["characteristic"]).trim().isAlpha().withMessage("cannot be empty"),
	body(["value"]).isLength({min:8,max:40}).isAlphanumeric().withMessage("cannot be empty"),
];


exports.messages =  (req, res,next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}else{
		next();
	}
	
};