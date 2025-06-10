// utilities/inventory-validation.js
const utilities = require('.')
const { body, validationResult } = require('express-validator')

const validate = {}

/* ************************************************
 *  Inventory Item Validation Rules (sanitize + validate)
 * ***********************************************/
validate.inventoryRules = () => [
  body('inv_make')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Make is required.'),
  body('inv_model')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Model is required.'),
  body('inv_year')
    .trim()
    .isLength({ min: 4, max: 4 })
    .withMessage('Year must be 4 digits.'),
  body('inv_description')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Description is required.'),
  body('inv_image')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Image filename is required.'),
  body('inv_thumbnail')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Thumbnail filename is required.'),
  body('inv_price')
    .trim()
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number.'),
  body('inv_miles')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Mileage must be a non-negative integer.'),
  body('inv_colcr')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Color is required.'),
  body('classification_id')
    .trim()
    .isInt()
    .withMessage('Classification is required.')
]

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    // rebuild classification select list
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    return res.status(400).render('inventory/add-inventory', {
      title: 'Add Vehicle',
      nav,
      errors,
      data: req.body,
      classificationList,
    })
  }
  next()
}

module.exports = validate
