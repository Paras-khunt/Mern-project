const ErrorHandler = require("../utils/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const User = require("../models/userModels")
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require('crypto')
const cloudinary = require("cloudinary")

//=========Register User===================================================================

exports.registerUser = catchAsyncError(async (req, resp, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale"
    })

    const { name, email, password } = req.body

    const user = await User.create({
        name, email, password, avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })
    sendToken(user, 200, resp)
})

//=========LOGIN USER===============================================================================================

exports.loginUSer = catchAsyncError(async (req, resp, next) => {

    const password = req.body.password
    const email = req.body.email

    // if (!password || !email) {
    //     return next(new ErrorHandler("Please Enter Email and Password", 400))
    // }

    const user = await User.findOne({ email: email }).select("+password")

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }
    sendToken(user, 200, resp)
})

//===========LOGOUT USER===================================================

exports.logoutUser = catchAsyncError(async (req, resp, next) => {

    resp.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    resp.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

//=============FORGOT PASSWORD==========================================================================

exports.forgotPassword = catchAsyncError(async (req, resp, next) => {

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    //======GET RESETPASSORD TOKEN=================================================================
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message
        })
        resp.status(200).json({
            success: true,
            message: `Email sent to ${user.email} sucessfully`
        })

    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))

    }

})
//========RESET PASSWORD================================================================

exports.resetPassword = catchAsyncError(async (req, resp, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }

    })

    if (!user) {
        return next(new ErrorHandler("Reset Pasword Token Is Invalid or Has Been Expires", 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Pasword does not match with Confirm password", 400))
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined

    await user.save()
    sendToken(user, 200, resp)
})

//==========GET USER DETAILS===================================================

exports.getUserDetail = catchAsyncError(async (req, resp, next) => {
    const user = await User.findById(req.user.id)


    resp.status(200).json({
        success: true,
        user
    })
})

//=========================CHANGE PASSWORD===================================================
exports.changePassword = catchAsyncError(async (req, resp, next) => {
    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password id incorrect", 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("New Pasword does not match with Confirm password", 400))
    }

    user.password = req.body.newPassword

    await user.save()
    sendToken(user, 200, resp)
})

//=========================UPDATE PROFILE===================================================
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

//==========GET ALL USERS DETAILS=========================================

exports.getAllUsers = catchAsyncError(async (req, resp, next) => {

    const users = await User.find()
    if (!users) {
        return next(new ErrorHandler("Users can not found", 400))
    }
    resp.status(200).json({
        success: true,
        users
    })
})

//==========GET SINGLE USER DETAILS=========================================

exports.getOneUser = catchAsyncError(async (req, resp, next) => {

    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHandler("User can not found", 400))
    }
    resp.status(200).json({
        success: true,
        user
    })
})

//=======UPDATE USER PROFILE BY ADMIN==========================================

exports.updateUserProfile = catchAsyncError(async (req, resp, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    resp.status(200).json({
        success: true
    })
})

//============REMOVE USER BY ADMIN================================

exports.deleteUSer = catchAsyncError(async (req, resp, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove()
    resp.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})