// controllers/invController.js
const invModel  = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 ****************************/
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
 ****************************/
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
 *****************************************/
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    // build classification select list
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

/* ****************************************
 *  Deliver add classification view
 *****************************************/
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
 *****************************************/
invCont.registerClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { classification_name } = req.body
    const newClass = await invModel.addClassification(classification_name)
    req.flash("notice", `Classification '${newClass.classification_name}' added.`)
    res.render("inventory/management", { title: "Inventory Management", nav })
  } catch (error) {
    next(error)
  }
}

/* ***************************************
 *  Deliver add inventory view
 ***************************************/
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
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
 ***************************************/
invCont.registerInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const {
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    } = req.body

    const newInv = await invModel.addInventory(
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    )

    req.flash("notice", `Vehicle '${newInv.inv_make} ${newInv.inv_model}' added.`)
    res.redirect("/inv/")
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Return inventory JSON for AJAX
 ****************************/
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData.length) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build edit inventory view
 ****************************/
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav    = await utilities.getNav()
    const item   = await invModel.getInventoryById(inv_id)
    if (!item) {
      return next(new Error("Inventory item not found"))
    }
    const classificationSelect = await utilities.buildClassificationList(item.classification_id)
    const itemName             = `${item.inv_make} ${item.inv_model}`

    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id:           item.inv_id,
      inv_make:         item.inv_make,
      inv_model:        item.inv_model,
      inv_year:         item.inv_year,
      inv_description:  item.inv_description,
      inv_image:        item.inv_image,
      inv_thumbnail:    item.inv_thumbnail,
      inv_price:        item.inv_price,
      inv_miles:        item.inv_miles,
      inv_color:        item.inv_color,
      classification_id: item.classification_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Update inventory data
 ****************************/
invCont.updateInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const {
      inv_id, inv_make, inv_model, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_year,
      inv_miles, inv_color, classification_id
    } = req.body

    const updateResult = await invModel.updateInventory(
      inv_id, inv_make, inv_model, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_year,
      inv_miles, inv_color, classification_id
    )

    if (updateResult) {
      const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
      req.flash("notice", `The ${itemName} was successfully updated.`)
      return res.redirect("/inv/")
    }

    // on failure
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName             = `${inv_make} ${inv_model}`
    req.flash("warning", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************************
 *  Deliver delete confirmation view
 *****************************************/
invCont.deleteInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav    = await utilities.getNav()
    const item   = await invModel.getInventoryById(inv_id)
    if (!item) {
      return next(new Error("Inventory item not found"))
    }
    const itemName = `${item.inv_make} ${item.inv_model}`

    res.render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id:   item.inv_id,
      inv_make: item.inv_make,
      inv_model: item.inv_model,
      inv_year: item.inv_year,
      inv_price: item.inv_price,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************************
 *  Process delete request
 *****************************************/
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const result = await invModel.deleteInventoryItem(inv_id)
    if (result.rowCount) {
      req.flash("notice", "Vehicle successfully deleted.")
      return res.redirect("/inv/")
    }
    req.flash("warning", "Delete failed. Please try again.")
    res.redirect(`/inv/delete/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
