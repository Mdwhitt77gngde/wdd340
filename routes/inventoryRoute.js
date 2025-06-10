// routes/inventoryRoute.js
const express             = require("express")
const router              = express.Router()
const utilities           = require("../utilities")
const invController       = require("../controllers/inventoryController")

// Validation middlewares need to be imported:
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidate      = require("../utilities/inventory-validation")

// Management View Route (Task 1)
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Classification View
router.get(
  "/type/:classification_Id",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle Detail
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetail)
)

// Add Classification Form (Task 2)
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process Classification (Task 2)
router.post(
  "/add-classification",
  classificationValidate.registrationRules(),  // example rules fn
  classificationValidate.checkRegData,          // example check fn
  utilities.handleErrors(invController.registerClassification)
)

// Add Inventory Form (Task 3)
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process Inventory (Task 3)
router.post(
  "/add-inventory",
  inventoryValidate.registrationRules(),  // example rules fn
  inventoryValidate.checkRegData,         // example check fn
  utilities.handleErrors(invController.registerInventory)
)

module.exports = router
