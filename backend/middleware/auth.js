const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError")
const jwt = require('jsonwebtoken');
const User = require("../models/userModels");



exports.isAuth = catchAsyncError(async (req, resp, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401))
    }

    const decodedata = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decodedata.id)
 next()
})


exports.isAuthAdmin = catchAsyncError(async (req, resp, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401))
    }

    const decodedata = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decodedata.id)
 next()
})

exports.authRoles = (...roles) => {
    return (req, resp, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(
                `${req.user.role} is not allowed to access this resource`, 403
            ))
        }
        next();
    }

}



