// utilities/account-validation.js
const utilities = require('.')
const { body, validationResult } = require('express-validator')
const accountModel = require('../models/account-model')

const validate = {}

/* **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a first name.'),

    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a last name.'),

    body('account_email')
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.')
      .custom(async (account_email) => {
        const exists = await accountModel.checkExistingEmail(account_email)
        if (exists) {
          throw new Error('Email exists. Please log in or use a different email.')
        }
      }),

    body('account_password')
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        'Password must be 12+ chars with uppercase, number, and symbol.'
      ),
  ]
}

validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email } = req.body
    return res.status(400).render('account/register', {
      title: 'Register',
      nav,
      errors,
      data: { account_firstname, account_lastname, account_email },
    })
  }
  next()
}

/* **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () =>[
    body('account_email')
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage('A valid email is required.'),
      body('account_password')
      .trim()
      .notEmpty()
      .withMessage('password is required.'),
]

validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors,
    })
  }
  next()
}

module.exports = validate