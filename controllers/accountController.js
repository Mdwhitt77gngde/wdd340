// controllers/accountController.js

const utilities    = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt       = require("bcryptjs");
const jwt          = require("jsonwebtoken");
require("dotenv").config();

const accountController = {};

/* ****************************************
 *  Deliver login view
 *****************************************/
accountController.buildLogin = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title:         "Login",
      nav,
      errors:        null,
      account_email: "",
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Deliver registration view
 *****************************************/
accountController.buildRegister = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      data:   {},
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process Registration
 *****************************************/
accountController.registerAccount = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    } = req.body;

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (regResult && regResult.account_id) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    }

    // Insertion unexpectedly failed
    req.flash("notice", "Registration failed. Please try again.");
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      data:   { account_firstname, account_lastname, account_email },
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process login request
 *****************************************/
accountController.accountLogin = async (req, res, next) => {
  try {
    const nav             = await utilities.getNav();
    const { account_email, account_password } = req.body;

    // 1) fetch by email
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title:         "Login",
        nav,
        errors:        null,
        account_email, 
      });
    }

    // 2) verify password
    const match = await bcrypt.compare(
      account_password,
      accountData.account_password
    );
    if (!match) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title:         "Login",
        nav,
        errors:        null,
        account_email, 
      });
    }

    // 3) remove password from payload
    delete accountData.account_password;

    // 4) sign JWT
    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 } // 1h in seconds
    );

    // 5) set cookie
    const cookieOptions = {
      httpOnly: true,
      maxAge:   3600 * 1000, // 1h in ms
    };
    if (process.env.NODE_ENV !== "development") cookieOptions.secure = true;
    res.cookie("jwt", accessToken, cookieOptions);

    // 6) redirect to account management
    return res.redirect("/account/");
  } catch (err) {
    next(err);
  }
};

/* ****************************************
 *  Deliver account management view
 *****************************************/
accountController.buildAccountManagement = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.render("account/management", {
      title: "My Account",
      nav,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = accountController;
