// routes/inventoryRoute.js
const express       = require("express")
const router        = express.Router()
const utilities     = require("../utilities")
const invController = require("../controllers/invController")

// Management View
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Ajax endpoint for JSON
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

module.exports = router
