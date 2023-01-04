const ErrorHandler = require("../utils/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.processPayment = catchAsyncError(async (req, resp, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        metadata: {
            company: "Ecommerce"
        }
    })
    resp.status(200).json({ success: true, client_secret: myPayment.client_secret })

})

exports.sendStripeApiKey = async (req, resp, next) => {
    const stripeApiKey = process.env.STRIPE_API_KEY
    resp.status(200).json({ stripeApiKey })

}