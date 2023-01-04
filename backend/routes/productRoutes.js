const express = require('express')
const { getAllProducts, createProducts, updateProducts, deleteProduct, getProductDetais, createProductReview, getProductReviews, deleteReview, getAdminProducts } = require('../controllers/productController')
const { isAuth, authRoles } = require('../middleware/auth')


const router = express.Router()

router.route("/products").get(getAllProducts)
router.route("/admin/products").get(isAuth, authRoles("admin"), getAdminProducts)
router.route("/admin/product/new").post(isAuth, authRoles("admin"), createProducts)
router.route("/admin/product/:id").put(isAuth, authRoles("admin"), updateProducts).delete(isAuth, authRoles("admin"), deleteProduct)
router.route("/product/:id").get(getProductDetais)
router.route("/review").put(isAuth, createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuth, deleteReview);
module.exports = router