// controllers/accountController.js
const utilities = require('../utilities')
const accountModel = require('../models/account-model')

/* **************************************
 *  Deliver login view
 * ************************************ */
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render('account/login', {
      title: 'Login',
      nav,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render('account/register', {
      title: 'Register',
      nav,
      errors: [],     // ensure errors array exists
      data: {},       // preserve any prior input
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Process Registration with Validation
 * *************************************** */
async function registerAccount(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    } = req.body

    // Server-side validation
    const errors = []
    if (!account_firstname.trim()) errors.push('First name is required.')
    if (!account_lastname.trim()) errors.push('Last name is required.')
    // rudimentary email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account_email)) {
      errors.push('A valid email address is required.')
    }
    // password pattern from HTML5
    const pwdPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/
    if (!pwdPattern.test(account_password)) {
      errors.push(
        'Passwords must be at least 12 characters, with 1 uppercase, 1 number, and 1 special character.'
      )
    }

    if (errors.length > 0) {
      // Re-render the form with errors and previously entered data
      return res.status(400).render('account/register', {
        title: 'Register',
        nav,
        errors,
        data: { account_firstname, account_lastname, account_email },
      })
    }

    // If validation passes, proceed to register
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )

    if (regResult && regResult.account_id) {
      req.flash(
        'notice',
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      )
      return res.status(201).render('account/login', {
        title: 'Login',
        nav,
      })
    }

    // Unexpected failure
    errors.push('Registration failed. Please try again.')
    res.status(500).render('account/register', {
      title: 'Register',
      nav,
      errors,
      data: { account_firstname, account_lastname, account_email },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }
