const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
// const Stripe = require('stripe');
// const stripe = Stripe('');
const STRIPE_API_KEY="sk_test_51L8jBVSJI0ypcj8Mh8kQhzpGBn8zogLlSq4goa8v0nIPErErVyXu4BEi8yNgrbnwVtph2yK00e3ZTikHCakhDOPe00LPVomVWo"

const stripe = require('stripe')(STRIPE_API_KEY);



// Process stripe payments   =>   /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',

        metadata: { integration_check: 'accept_a_payment' }
    });

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
})

// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripApi = catchAsyncErrors(async (req, res, next) => {
    console.log(STRIPE_API_KEY)
    res.status(200).json({
        
        stripeApiKey: STRIPE_API_KEY
    })

})