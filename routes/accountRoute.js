// routes/accountRoute.js
const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Deliver login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Process login request
router.post(
  "/login",
  regValidate.loginRules(),           // ← NEW
  regValidate.checkLoginData,         // ← NEW
  utilities.handleErrors(accountController.accountLogin) // ← NEW
)

// Deliver registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Process registration (existing)
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Account management view (after login)
router.get(
  "/",
  utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement)
)

// Account management (requires login)
router.get(
  "/",
  utilities.checkLogin,
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement)))

// Logout
router.post(
  "/logout",
  utilities.handleErrors(accountController.logout)
)

// Deliver update view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// Process update info
router.post(
  "/update",
  regValidate.updateInfoRules(),
  regValidate.checkUpdateInfo,
  utilities.handleErrors(accountController.updateAccountInfo)
)

// Process password change
router.post(
  "/password",
  regValidate.passwordRules(),
  regValidate.checkPassword,
  utilities.handleErrors(accountController.updatePassword)
)


module.exports = router
