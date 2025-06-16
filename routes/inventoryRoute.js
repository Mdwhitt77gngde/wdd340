// routes/inventoryRoute.js
const express         = require('express');
const router          = express.Router();
const utilities       = require('../utilities');
const invController   = require('../controllers/invController');
const classValidate   = require('../utilities/classification-validation');
const invValidate     = require('../utilities/inventory-validation');

/* ------------------------------
 *  Task 1: Management View
 * ---------------------------- */
router.get(
  '/',
  utilities.handleErrors(invController.buildManagement)
);

/* ------------------------------
 *  Task 2: Add Classification
 * ---------------------------- */
router.get(
  '/add-classification',
  utilities.handleErrors(invController.buildAddClassification)
);
router.post(
  '/add-classification',
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.registerClassification)
);

/* ------------------------------
 *  Task 3: Add Inventory
 * ---------------------------- */
router.get(
  '/add-inventory',
  utilities.handleErrors(invController.buildAddInventory)
);
router.post(
  '/add-inventory',
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.registerInventory)
);

/* ------------------------------
 *  AJAX: Return inventory JSON
 * ---------------------------- */
router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON)
);

/* ------------------------------
 *  Task 4: Edit Inventory Form
 * ---------------------------- */
router.get(
  '/edit/:inv_id',
  utilities.handleErrors(invController.editInventoryView)
);

/* ------------------------------
 *  Task 5: Update Inventory (not shown here)
 * ---------------------------- */
// router.post('/update-inventory', …)

module.exports = router;
