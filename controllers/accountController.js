// controllers/accountController.js

const utilities     = require("../utilities")
const accountModel  = require("../models/account-model")
const bcrypt        = require("bcryptjs")
const jwt           = require("jsonwebtoken")
require("dotenv").config()

const accountController = {}

/* ****************************************
 *  Deliver login view
 *****************************************/
accountController.buildLogin = async function (req, res, next) {
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
accountController.buildRegister = async function (req, res, next) {
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
accountController.registerAccount = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password
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
accountController.accountLogin = async function (req, res, next) {
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
      { expiresIn: 3600 } // 1h
    )

    // 5) Set cookie
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600 * 1000,
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
accountController.buildAccountManagement = async function (req, res, next) {
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

/* **********************************
 *  Deliver account update view
 ********************************** */
accountController.buildAccountUpdate = async function (req, res, next) {
  try {
    const nav  = await utilities.getNav()
    const acct = await accountModel.getAccountById(req.params.account_id)
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      data: acct,
    })
  } catch (error) {
    next(error)
  }
}

/* **********************************
 *  Process account info update
 ********************************** */
accountController.updateAccountInfo = async function (req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    await accountModel.updateAccountInfo(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )
    req.flash("notice", "Account information updated.")

    // re-sign token with new data
    const updated = await accountModel.getAccountById(account_id)
    delete updated.account_password
    const accessToken = jwt.sign(updated, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    res.cookie("jwt", accessToken, { httpOnly: true })

    res.redirect("/account/")
  } catch (error) {
    next(error)
  }
}

/* **********************************
 *  Process password change
 ********************************** */
accountController.updatePassword = async function (req, res, next) {
  try {
    const { account_id, new_password } = req.body
    const hashed = await bcrypt.hash(new_password, 12)
    await accountModel.updatePassword(account_id, hashed)
    req.flash("notice", "Password successfully changed.")
    res.redirect("/account/")
  } catch (error) {
    next(error)
  }
}

/* **********************************
 *  Logout
 ********************************** */
accountController.logout = async function (req, res, next) {
  try {
    res.clearCookie("jwt")
    res.redirect("/")
  } catch (error) {
    next(error)
  }
}

module.exports = accountController
