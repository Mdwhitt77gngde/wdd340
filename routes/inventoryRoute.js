// routes/inventoryRoute.js
const express         = require("express")
const router          = express.Router()
const utilities       = require("../utilities")
const invController   = require("../controllers/invController") // ← FIXED: match file name

const classValidate   = require("../utilities/classification-validation")
const invValidate     = require("../utilities/inventory-validation")

// Task 1: Management View
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Task 2: Add Classification
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)
router.post(
  "/add-classification",
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.registerClassification)
)

// Task 3: Add Inventory
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.registerInventory)
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

module.exports = router
