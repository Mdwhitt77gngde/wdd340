const pool = require("../database/")

/* *****************************
 * Add a new vehicle review
 * *************************** */
async function addReview(inv_id, account_id, review_rating, review_comment) {
  try {
    const sql = `
      INSERT INTO vehicle_review
        (inv_id, account_id, review_rating, review_comment)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `
    const data = await pool.query(sql, [inv_id, account_id, review_rating, review_comment])
    return data.rows[0]
  } catch (error) {
    console.error("addReview model error:", error)
    throw error
  }
}

/* *****************************
 * Fetch all reviews for a vehicle
 * *************************** */
async function getReviewsByInventory(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname
      FROM vehicle_review AS r
      JOIN account AS a USING(account_id)
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByInventory model error:", error)
    throw error
  }
}

module.exports = { addReview, getReviewsByInventory }
