// controllers/inventoryController.js

const invModel  = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build management view
 * ***************************/
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Return Inventory JSON
 * ***************************/
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id, 10);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData.length) {
      return res.json(invData);
    }
    next(new Error("No data returned"));
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build edit inventory view
 * ***************************/
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id:           itemData.inv_id,
    inv_make:         itemData.inv_make,
    inv_model:        itemData.inv_model,
    inv_year:         itemData.inv_year,
    inv_description:  itemData.inv_description,
    inv_image:        itemData.inv_image,
    inv_thumbnail:    itemData.inv_thumbnail,
    inv_price:        itemData.inv_price,
    inv_miles:        itemData.inv_miles,
    inv_color:        itemData.inv_color,         // ← include this!
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ***************************/
invCont.updateInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color: inv_colcr,
      classification_id,
    } = req.body;

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_colcr,
      classification_id
    );

    if (updateResult) {
      req.flash(
        "notice",
        `The ${updateResult.inv_make} ${updateResult.inv_model} was successfully updated.`
      );
      return res.redirect("/inv/");
    }

    // on failure, re-render edit
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: `Edit ${itemName}`,
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
      inv_colcr,
      classification_id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
