// controllers/accountController.js
const utilities = require('../utilities')
const accountModel = require('../models/account-model')

async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render('account/login', { title: 'Login', nav })
  } catch (error) {
    next(error)
  }
}

async function buildRegister(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render('account/register', {
      title: 'Register',
      nav,
      errors: null,   // ← ensure errors variable exists
      data: {},       // ← ensure data variable for stickiness
    })
  } catch (error) {
    next(error)
  }
}

async function registerAccount(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

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
      return res.status(201).render('account/login', { title: 'Login', nav })
    }

    // Unexpected failure
    req.flash('notice', 'Registration failed. Please try again.')
    res.status(500).render('account/register', {
      title: 'Register',
      nav,
      errors: null,
      data: { account_firstname, account_lastname, account_email },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }