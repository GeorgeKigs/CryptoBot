const express = require("express");
const {  stkPush, callback, results, timeout } = require("../../admin/controllers/mpesa");
// const { paymentConfirmation, paymentValidation } = require("../../admin/controllers/mpesa");
const { getAccessToken} = require("../../admin/utils/mpesa");
const { customerAuthorization } = require("../../utils/middleware");

const router = express.Router();

// router.route("/paymentConfirmation").post(paymentConfirmation);
// router.route("/paymentValidation").post(paymentValidation);
router.route("/results").post(results);
router.route("/timeout").post(timeout);
// router.route("/development/getAccessToken").get(getAccessToken);
// router.route("/development/C2B").post(C2B);
router.post("/stkPush",customerAuthorization,getAccessToken,stkPush);
router.post("/callback",callback);


module.exports = router;