// routes/inventoryRoute.js
const express       = require("express")
const router        = express.Router()
const utilities     = require("../utilities")
const invController = require("../controllers/invController")
const classValidate = require("../utilities/classification-validation")
const invValidate   = require("../utilities/inventory-validation")

/* ***************************************
 * Management View
 ****************************************/
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildManagement)
)

/* ***************************************
 * Add Classification
 ****************************************/
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

/* ***************************************
 * Add Inventory
 ****************************************/
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

/* ***************************************
 * Classification View
 ****************************************/
router.get(
  "/type/:classification_Id",
  utilities.handleErrors(invController.buildByClassificationId)
)

/* ***************************************
 * Vehicle Detail
 ****************************************/
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetail)
)

/* ***************************************
 * AJAX: Return inventory JSON
 ****************************************/
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

/* ***************************************
 * Edit Inventory View
 ****************************************/
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(invController.editInventoryView)
)

/* ***************************************
 * Update Inventory
 ****************************************/
router.post(
  "/update",
  utilities.checkLogin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

/* ***************************************
 * Delete Confirmation View
 ****************************************/
router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(invController.deleteInventoryView)
)

/* ***************************************
 * Process Deletion
 ****************************************/
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router
