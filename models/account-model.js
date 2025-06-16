// models/account-model.js
const pool = require('../database/')

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) " +
      "VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT 
        account_id, account_firstname, account_lastname, 
        account_email, account_type, account_password 
      FROM account 
      WHERE account_email = $1
    `
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    throw error
  }
}

/* **********************************
 *  Get account by ID
 ********************************** */
async function getAccountById(account_id) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname,
           account_email, account_type, account_password
    FROM account WHERE account_id = $1
  `
  const data = await pool.query(sql, [account_id])
  return data.rows[0]
}

/* **********************************
 *  Update account info
 ********************************** */
async function updateAccountInfo(account_id, fn, ln, email) {
  const sql = `
    UPDATE account
    SET account_firstname = $1,
        account_lastname  = $2,
        account_email     = $3
    WHERE account_id = $4
    RETURNING *
  `
  const data = await pool.query(sql, [fn, ln, email, account_id])
  return data.rows[0]
}

/* **********************************
 *  Update password
 ********************************** */
async function updatePassword(account_id, hashedPassword) {
  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
  `
  return pool.query(sql, [hashedPassword, account_id])
}


module.exports = { registerAccount, checkExistingEmail, getAccountByEmail }