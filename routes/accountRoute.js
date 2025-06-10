// routes/accountRoute.js (updated)
const express = require('express')
const router = express.Router()
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')

// Login view
router.get('/login', utilities.handleErrors(accountController.buildLogin))
// Process login (temporary stub)
router.post(
  '/login',
  regValidate.loginRules(),  // new login validation
  regValidate.checkLoginData,
  (req, res) => res.status(200).send('login process')
)
// Registration view
router.get('/register', utilities.handleErrors(accountController.buildRegister))
// Process registration with validation
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router