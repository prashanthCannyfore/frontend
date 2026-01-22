import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import paytm from 'paytmchecksum';
import https from 'https';
import Payment from '../models/paymentModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

// Process Payment via Paytm
export const processPayment = asyncErrorHandler(async (req, res, next) => {
    const { amount, email, phoneNo } = req.body;

    const params = {
        MID: process.env.PAYTM_MID,
        WEBSITE: process.env.PAYTM_WEBSITE,
        CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
        INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE,
        ORDER_ID: "oid" + uuidv4(),
        CUST_ID: process.env.PAYTM_CUST_ID,
        TXN_AMOUNT: String(amount),
        CALLBACK_URL: `https://${req.get("host")}/api/v1/callback`,
        EMAIL: email,
        MOBILE_NO: phoneNo,
    };

    try {
        const checksum = await paytm.generateSignature(params, process.env.PAYTM_MERCHANT_KEY);
        res.status(200).json({ paytmParams: { ...params, CHECKSUMHASH: checksum } });
    } catch (error) {
        console.error("Paytm checksum generation failed:", error);
        return next(new ErrorHandler("Payment Initialization Failed", 500));
    }
});

// Paytm Callback
export const paytmResponse = asyncErrorHandler(async (req, res, next) => {
    const { CHECKSUMHASH, ...rest } = req.body;

    const isVerifySignature = paytm.verifySignature(rest, process.env.PAYTM_MERCHANT_KEY, CHECKSUMHASH);

    if (!isVerifySignature) {
        console.error("Paytm Checksum Mismatched");
        return next(new ErrorHandler("Checksum Mismatch", 400));
    }

    const paytmParams = {
        body: {
            mid: req.body.MID,
            orderId: req.body.ORDERID,
        }
    };

    try {
        const signature = await paytm.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY);
        paytmParams.head = { signature };

        const postData = JSON.stringify(paytmParams);

        const options = {
            hostname: 'securegw-stage.paytm.in', // Use securegw.paytm.in for production
            port: 443,
            path: '/v3/order/status',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        const response = await new Promise((resolve, reject) => {
            const reqPost = https.request(options, (resPost) => {
                let data = '';
                resPost.on('data', chunk => data += chunk);
                resPost.on('end', () => resolve(data));
            });
            reqPost.on('error', reject);
            reqPost.write(postData);
            reqPost.end();
        });

        const { body } = JSON.parse(response);
        await addPayment(body);

        // Redirect user to order page
        res.redirect(`https://${req.get("host")}/order/${body.orderId}`);

    } catch (error) {
        console.error("Paytm Response Error:", error);
        return next(new ErrorHandler("Payment Processing Failed", 500));
    }
});

// Store Payment in DB
const addPayment = async (data) => {
    try {
        await Payment.create(data);
    } catch (error) {
        console.error("Payment saving failed:", error);
    }
};

// Get Payment Status
export const getPaymentStatus = asyncErrorHandler(async (req, res, next) => {
    const payment = await Payment.findOne({ orderId: req.params.id });

    if (!payment) {
        return next(new ErrorHandler("Payment Details Not Found", 404));
    }

    const txn = {
        id: payment.txnId,
        status: payment.resultInfo?.resultStatus || "Unknown",
    };

    res.status(200).json({ success: true, txn });
});
