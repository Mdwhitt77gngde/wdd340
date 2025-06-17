const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const reviewController = require("../controllers/reviewController")
const { body, validationResult } = require("express-validator")

// Deliver review form
router.get(
  "/add/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildReviewForm)
)

// Validation rules
const reviewRules = () => [
  body("review_rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review_comment")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty")
]

// Process review submission
router.post(
  "/add",
  utilities.checkLogin,
  reviewRules(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return next({ array: () => errors.array() })
    next()
  },
  utilities.handleErrors(reviewController.addReview)
)

// JSON API for reviews
router.get(
  "/list/:inv_id",
  utilities.handleErrors(reviewController.getReviewsJSON)
)

module.exports = router
