const express = require("express");
const { clientAuthorization, customerAuthorization } = require("../../utils/middleware");
const { validateMessage,messages } = require("../../utils/validation");
const { getSingleProductReview, emailReviewReply } = require("../controllers/reviews");

const router = express.Router();

// method of getting the data query or json
router.get("/getReview",getSingleProductReview);
router.post("/emailReview",
	customerAuthorization,
	clientAuthorization,
	validateMessage,
	messages,
	emailReviewReply
);

module.exports = router;