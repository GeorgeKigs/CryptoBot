const express = require("express");
const { validateReviews, messages } = require("../../utils/validation");
const { postReview } = require("../controllers/reviews");

const router = express.Router();

router.route("/",validateReviews,messages).post(postReview);

module.exports = router;