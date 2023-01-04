const mongoose = require("mongoose")
const user = require("./userModels")


const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "Please Enter Shipping Address "]
        },
        city: {
            type: String,
            required: [true, "Please Enter Your City "]
        },
        state: {
            type: String,
            required: [true, "Please Enter Your State "]
        },
        country: {
            type: String,
            required: [true, "Please Enter Your Country "]
        },
        pincode: {
            type: Number,
            require: [true, "Please Enter Your Pincode"]
        },
        phoneNo: {
            type: Number,
            require: [true, "Please Enter Your PhoneNo."]
        }
    },
    orderItems: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            default: true
        },
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: user,
        default: true
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt: {
        type: Date,
        required: true
    },
    itemPrice: {
        type: Number,
        default: 0,
        required: true
    },
    taxPrice: {
        type: Number,
        default: 0,
        required: true
    },
    shippingPrice: {
        type: Number,
        default: 0,
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing"
    },
    deliveredAt: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }


})

module.exports = mongoose.model("Order", orderSchema)