// routes/inventoryRoute.js

const express       = require("express")
const router        = express.Router()
const utilities     = require("../utilities")
const invController = require("../controllers/invController")  // ← your controller file is invController.js

// Task 1: Management View
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Task 1b: Return management JSON (for AJAX)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Task 2: Add Classification
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)
router.post(
  "/add-classification",
  utilities.handleErrors(invController.registerClassification)
)

// Task 3: Add Inventory
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)
router.post(
  "/add-inventory",
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

// Task 4: Edit Inventory View
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)

// Task 6: Update Inventory (form POST)
router.post(
  "/update",
  utilities.handleErrors(invController.updateInventory)
)

// Task 7: Delete Inventory View
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteInventoryView)
)

// Task 7b: Process Delete
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router
