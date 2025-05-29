//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

//Route to build inventory by classification view
router.get("/type/:classification_Id",invController.buildByClassificationId);

//vehicle details route
//router.get("/detail/:invId", invController.buildByInventoryId)check
router.get("/detail/:inv_id", invController.buildDetail)

module.exports = router;
