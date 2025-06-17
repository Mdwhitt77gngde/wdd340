const utilities = require("../utilities")
const reviewModel = require("../models/review-model")

const reviewController = {}

/* *****************************
 * Deliver review submission view
 * *************************** */
reviewController.buildReviewForm = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    const { inv_id } = req.params
    res.render("reviews/form", {
      title: "Leave a Review",
      nav,
      inv_id,
      errors: null,
      data: {}
    })
  } catch (error) {
    next(error)
  }
}

/* *****************************
 * Process review submission
 * *************************** */
reviewController.addReview = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    const accountData = res.locals.accountData
    const { inv_id, review_rating, review_comment } = req.body

    // insert into DB
    await reviewModel.addReview(
      parseInt(inv_id),
      accountData.account_id,
      parseInt(review_rating),
      review_comment.trim()
    )

    req.flash("notice", "Thank you for your review!")
    res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    // validation errors come back here
    const nav = await utilities.getNav()
    res.status(400).render("reviews/form", {
      title: "Leave a Review",
      nav,
      inv_id: req.body.inv_id,
      errors: error.array ? error.array() : null,
      data: req.body
    })
  }
}

/* *****************************
 * Fetch reviews JSON (AJAX)
 * *************************** */
reviewController.getReviewsJSON = async (req, res, next) => {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const reviews = await reviewModel.getReviewsByInventory(inv_id)
    res.json(reviews)
  } catch (error) {
    next(error)
  }
}

module.exports = reviewController
