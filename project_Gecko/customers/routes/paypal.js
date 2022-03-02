const express = require("express");
const { charge, failure, success } = require("../../admin/controllers/paypal");

const router = express.Router();

router.route("/paypal/charge").post(charge);
router.route("/paypal/failure").post(failure);
router.route("/paypal/success").post(success);

module.exports = router;