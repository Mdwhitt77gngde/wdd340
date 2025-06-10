// controllers/inventoryController.js
const invModel  = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************* */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_Id)
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("inventory/classification", { title: className + " vehicles", nav, grid })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build single vehicle detail view
 * ************************* */
invCont.buildDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getInventoryById(inv_id)
    const nav = await utilities.getNav()

    if (!data) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "Sorry, we cannot find that vehicle.",
        nav,
      })
    }

    const vehicleName = `${data.inv_make} ${data.inv_model}`
    const vehicleHtml = utilities.buildVehicleDetailView(data)

    res.render("inventory/detail", { title: vehicleName, nav, vehicleHtml })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Deliver management view
 * **************************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/management", { title: "Inventory Management", nav })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Deliver add classification view
 * **************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Process new classification
 * **************************************** */
invCont.registerClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { classification_name } = req.body
    const newClass = await invModel.addClassification(classification_name)
    req.flash("notice", `Classification '${newClass.classification_name}' added.`)
    // re-render management view with updated nav
    res.render("inventory/management", { title: "Inventory Management", nav })
  } catch (error) {
    next(error)
  }
}

/* ***************************************
 *  Deliver add inventory view
 * ************************************* */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    // build classification select list for initial load
    const classificationList = await utilities.buildClassificationList()
    res.render('inventory/add-inventory', {
      title: 'Add Vehicle',
      nav,
      errors: null,
      data: {},
      classificationList,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************************
 *  Process new inventory item
 * ************************************* */
invCont.registerInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const {
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_colcr, classification_id
    } = req.body

    const newInv = await invModel.addInventory(
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_colcr, classification_id
    )

    req.flash('notice', `Vehicle '${newInv.inv_make} ${newInv.inv_model}' added.`)
    // Redirect back to management view
    res.render('inventory/management', { title: 'Inventory Management', nav })
  } catch (error) {
    next(error)
  }
}


module.exports = invCont
