// controllers/inventoryController.js
const invModel  = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ****************************************
 *  Deliver management view
 * **************************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    // build the classification select list
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id, 10)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData.length) {
      return res.json(invData)
    }
    next(new Error("No data returned"))
  } catch (err) {
    next(err)
  }
}

module.exports = invCont
