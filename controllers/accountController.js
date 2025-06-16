// controllers/accountController.js

const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountController = {}

/* ****************************************
 *  Deliver login view
 *****************************************/
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: "",
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Deliver registration view
 *****************************************/
async function buildRegister(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Process Registration
 *****************************************/
async function registerAccount(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // ** Hash the password before saving **
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(account_password, saltRounds)

    const newAccount = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (newAccount && newAccount.account_id) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      )
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    // Unexpected failure
    req.flash("notice", "Registration failed. Please try again.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      data: { account_firstname, account_lastname, account_email },
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Process login request
 *****************************************/
async function accountLogin(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { account_email, account_password } = req.body

    // 1) Fetch user by email
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    // 2) Compare password
    const match = await bcrypt.compare(account_password, accountData.account_password)
    if (!match) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    // 3) Remove password from payload
    delete accountData.account_password

    // 4) Sign a JWT
    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 } // 1 hour in seconds
    )

    // 5) Set cookie
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600 * 1000, // 1 hour in ms
    }
    if (process.env.NODE_ENV !== "development") cookieOptions.secure = true
    res.cookie("jwt", accessToken, cookieOptions)

    // 6) Redirect to account management
    return res.redirect("/account/")
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Deliver account management view
 *****************************************/
async function buildAccountManagement(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/management", {
      title: "My Account",
      nav,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
}
