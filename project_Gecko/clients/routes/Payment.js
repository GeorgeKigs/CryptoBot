const express = require("express");
const { stkPush } = require("../../admin/controllers/mpesa");
const { getPaymentDetails, editPaymentDetails, addPaymentDetails, deletePayment, payOrganization } = require("../controllers/payment");


const router = express.Router();

router.get("/getPaymentDetails",getPaymentDetails);
router.post("/editPaymentDetails",editPaymentDetails);
router.post("/addPaymentDetails",addPaymentDetails);
router.delete("/deletePayment",deletePayment);
router.post("/payOrganization",payOrganization,stkPush);


module.exports = router;