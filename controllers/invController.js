// controllers/inventoryController.js
const invModel    = require("../models/inventory-model")
const utilities   = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 *****************************/
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_Id)
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const nav  = await utilities.getNav()
    const className = data[0].classification_name

    res.render("inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build single vehicle detail view
 *****************************/
invCont.buildDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const data   = await invModel.getInventoryById(inv_id)
    const nav    = await utilities.getNav()

    if (!data) {
      return res.status(404).render("errors/error", {
        title:   "Vehicle Not Found",
        message: "Sorry, we cannot find that vehicle.",
        nav,
      })
    }

    const vehicleName = `${data.inv_make} ${data.inv_model}`
    const vehicleHtml = utilities.buildVehicleDetailView(data)

    res.render("inventory/detail", {
      title:       vehicleName,
      nav,
      vehicleHtml,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Deliver management view
 *******************************************/
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
