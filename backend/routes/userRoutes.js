const express = require('express')
const { registerUser, loginUSer, logoutUser, forgotPassword, resetPassword, getUserDetail, changePassword, updateProfile, getAllUsers, getOneUser, updateUserProfile, deleteUSer } = require("../controllers/userController")
const router = express.Router()
const { isAuth, authRoles, isAuthAdmin } = require('../middleware/auth')

router.route("/register").post(registerUser)
router.route("/login").post(loginUSer)
router.route("/logout").get(logoutUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuth, getUserDetail)
router.route("/changePassword").put(isAuth, changePassword)
router.route("/me/updateProfile").put(isAuth, updateProfile)
router.route("/admin/getUsers").get(isAuth, authRoles("admin"), getAllUsers)
router.route("/admin/getUser/:id").get(isAuth, authRoles("admin"), getOneUser).put(isAuthAdmin, authRoles("admin"), updateUserProfile).delete(isAuthAdmin, authRoles("admin"), deleteUSer)

module.exports = router