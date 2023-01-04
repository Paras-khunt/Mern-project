const Order = require("../models/orderModels")
const Product = require("../models/productModels")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError")



//=====CREATE NEW ORDER===================================================================================

exports.newOrder = catchAsyncError(async (req, resp, next) => {
    const { shippingInfo, orderItems, paymentInfo, taxPrice, itemPrice, shippingPrice, totalPrice } = req.body


    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, shippingPrice, taxPrice, itemPrice, totalPrice, user: req.user._id, paidAt: Date.now()
    })

    resp.status(201).json({
        success: true,
        order
    })
})


//========GET SINGLE ORDER BY ADMIN=======================================================================

exports.getSingleOrder = catchAsyncError(async (req, resp, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user", "name email"
    )
    if (!order) {
        return next(new ErrorHandler("Order not found", 400))
    }
    resp.status(200).json({
        success: true,
        order
    })
})

//========GET ORDER BY LOGGED USER=======================================================================

exports.myOrder = catchAsyncError(async (req, resp, next) => {
    const orders = await Order.find({ user: req.user._id })
    if (!orders) {
        return next(new ErrorHandler("Order not found", 400))
    }
    resp.status(200).json({
        success: true,
        orders
    })
})
//=========GET ALL ORDERS BY ADMIN========================================
exports.getAllOrders = catchAsyncError(async (req, resp, next) => {
    const orders = await Order.find().populate(
        "user", "name email"
    )
    if (!orders) {
        return next(new ErrorHandler("Order not found", 400))
    }
    let totalAmount = 0
    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })
    resp.status(200).json({
        success: true,
        orders,
        totalAmount
    })
})

//=========UPDATE ORDER BY ADMIN========================================
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHander("You have already delivered this order", 400));
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.Stock -= quantity;

    await product.save({ validateBeforeSave: false });
}

//=========DELETE ORDER BY ADMIN========================================
exports.deleteOrder = catchAsyncError(async (req, resp, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ErrorHandler("Order not found", 400))
    }



    await order.remove()

    resp.status(200).json({
        success: true,


    })
})