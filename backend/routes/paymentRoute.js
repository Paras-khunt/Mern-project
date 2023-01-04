const express = require('express')
const { processPayment, sendStripeApiKey } = require('../controllers/paymentController')
const { isAuth, authRoles } = require('../middleware/auth')

const router = express.Router()


router.route("/payment/process").post(isAuth, processPayment)
router.route("/stripeapikey").get(isAuth, sendStripeApiKey)

module.exports = router