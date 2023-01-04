const express = require("express")
const { newOrder, getSingleOrder, myOrder, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController")
const router = express.Router()
const { isAuth, authRoles } = require('../middleware/auth')

router.route("/order/new").post(isAuth, newOrder)
router.route("/order/:id").get(isAuth, getSingleOrder)
router.route("/orders/me").get(isAuth, myOrder)
router.route("/admin/allOrders").get(isAuth, authRoles('admin'), getAllOrders)
router.route("/admin/order/:id").put(isAuth, authRoles('admin'), updateOrder)
router.route("/admin/order/:id").delete(isAuth, authRoles('admin'), deleteOrder)


module.exports = router