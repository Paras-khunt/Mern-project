const Product = require("../models/productModels")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const ApiFeatures = require("../utils/apifeatures")
const cloudinary = require('cloudinary')

//============CREATED BY ADMIN=====================================================================

exports.createProducts = catchAsyncError(async (req, resp, next) => {

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    resp.status(201).json({
        success: true,
        product,
    });
});

//=========GET ALL PRODUCTS==========================================================================

exports.getAllProducts = catchAsyncError(async (req, resp, next) => {

    const resultPerPage = 15;
    const productsCount = await Product.countDocuments()


    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)
    const products = await apiFeatures.query



    resp.status(200).json({
        success: true,
        products,
        resultPerPage,
        productsCount,
    })
})

//=========GET ALL PRODUCTS(BY ADMIN)==========================================================================

exports.getAdminProducts = catchAsyncError(async (req, resp, next) => {
user = req.user

    const product = await Product.find();


 


    function check(item) {
        return item.user == user.id;
      }

    const products = product.filter(check);
   



    resp.status(200).json({
        success: true,
        products,

    })
})

//========GET PRODUCTS DETAILS====================================================================

exports.getProductDetais = catchAsyncError(async (req, resp, next) => {
    const product = await Product.findById(req.params.id)



    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    resp.status(200).json({
        success: true,
        product,

    })
})

//============UPDATE BY ADMIN========================================================================
exports.updateProducts = catchAsyncError(async (req, resp, next) => {

    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {

        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
        req.body.images = imagesLinks
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })


    resp.status(200).json({
        success: true,
        product
    })
})

//=========DELETE PRODUCT BY ADMIN================================================================

exports.deleteProduct = catchAsyncError(async (req, resp, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.remove()
    resp.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})



//Create New Review or Update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
user = req.user

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
});