// utilities/classification-validation.js
const utilities = require('.')
const { body, validationResult } = require('express-validator')
const invModel = require('../models/inventory-model')

const validate = {}

/* **************************************
 * Classification Validation Rules
 * ************************************ */
validate.classificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Classification name is required.')
      .isAlphanumeric()
      .withMessage('Classification must not contain spaces or special characters.'),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.status(400).render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
      errors,
      data: { classification_name: req.body.classification_name },
    })
  }
  next()
}

module.exports = validate
