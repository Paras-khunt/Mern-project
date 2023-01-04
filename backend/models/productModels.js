const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxLength: [8, "price cannot exceed 8 characters "]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"]
    },
    stock: {
        type: Number,
        required: [true, "Please Enter Product Stock"],
        maxLength: [8, "Stock cannot exceed 8 charactor"],
        default: 0
    },
    numOfReviews: {
        type: String,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                default: true
            },
            name: {
                type: String,
                required: [true, "Please Enter your name"]
            },
            comment: {
                type: String,
                required: [true, "Please Enter Comment"]
            },
            rating: {
                type: Number,
                default: 0
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})


module.exports = mongoose.model("Product", productSchema)