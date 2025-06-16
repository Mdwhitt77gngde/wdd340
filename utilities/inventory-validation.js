// utilities/inventory-validation.js

const utilities       = require(".");
const { body, validationResult } = require("express-validator");

const validate = {};

/* ************************************************
 *  Inventory Item Validation Rules
 * ***********************************************/
validate.inventoryRules = () => [
  body("inv_make").trim().escape().notEmpty().withMessage("Make is required."),
  body("inv_model").trim().escape().notEmpty().withMessage("Model is required."),
  body("inv_year")
    .trim()
    .isLength({ min: 4, max: 4 })
    .withMessage("Year must be 4 digits."),
  body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Description is required."),
  body("inv_image").trim().escape().notEmpty().withMessage("Image filename is required."),
  body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Thumbnail filename is required."),
  body("inv_price")
    .trim()
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number."),
  body("inv_miles")
    .trim()
    .isInt({ min: 0 })
    .withMessage("Mileage must be a non‑negative integer."),
  body("inv_colcr").trim().escape().notEmpty().withMessage("Color is required."),
  body("classification_id")
    .trim()
    .escape()
    .notEmpty()
    .isInt()
    .withMessage("Classification is required."),
];

/* ************************************************
 *  Check Add Inventory Data
 * ***********************************************/
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id
    );
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      errors,
      data: req.body,
      classificationSelect,
    });
  }
  next();
};

/* ************************************************
 *  Check Update Inventory Data
 * ***********************************************/
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id
    );
    return res.status(400).render("inventory/edit-inventory", {
      title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
      nav,
      errors,
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_colcr: req.body.inv_colcr,
      classification_id: req.body.classification_id,
      classificationSelect,
    });
  }
  next();
};

module.exports = validate;
