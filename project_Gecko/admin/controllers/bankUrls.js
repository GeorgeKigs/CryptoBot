const bankTrans = require("../models/bankTrans");
// const stripe = require('stripe')(process.env.BANK_SECRETKEY);

exports.charge = async (req,res,next) => {
    try {
        const amount = '';
        
        
    } catch (error) {
        next(error)
    }
}