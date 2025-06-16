// controllers/inventoryController.js

const invModel  = require('../models/inventory-model');
const utilities = require('../utilities');

const invCont = {};

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_Id, 10);
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav  = await utilities.getNav();
    const className = data[0]?.classification_name || 'Unknown';
    res.render('inventory/classification', {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Build single vehicle detail view
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id, 10);
    const data   = await invModel.getInventoryById(inv_id);
    const nav    = await utilities.getNav();

    if (!data) {
      return res.status(404).render('errors/error', {
        title: 'Vehicle Not Found',
        message: 'Sorry, we cannot find that vehicle.',
        nav,
      });
    }

    const vehicleName = `${data.inv_make} ${data.inv_model}`;
    const vehicleHtml = utilities.buildVehicleDetailView(data);

    res.render('inventory/detail', {
      title: vehicleName,
      nav,
      vehicleHtml,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Deliver management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    // Also build classification select list for filtering
    const classificationSelect = await utilities.buildClassificationList();
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Deliver add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
      errors: null,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Process new classification
 * ************************** */
invCont.registerClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { classification_name } = req.body;
    const newClass = await invModel.addClassification(classification_name);
    req.flash('notice', `Classification '${newClass.classification_name}' added.`);
    // Re-render management view with updated nav & select list
    const classificationSelect = await utilities.buildClassificationList();
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Deliver add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    // Build classification select list for initial load
    const classificationSelect = await utilities.buildClassificationList();
    res.render('inventory/add-inventory', {
      title: 'Add Vehicle',
      nav,
      errors: null,
      data: {},
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Process new inventory item
 * ************************** */
invCont.registerInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const {
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_colcr, classification_id,
    } = req.body;

    const newInv = await invModel.addInventory(
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_colcr, classification_id
    );

    req.flash('notice', `Vehicle '${newInv.inv_make} ${newInv.inv_model}' added.`);
    // Redirect back to management view
    const classificationSelect = await utilities.buildClassificationList();
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id, 10);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData.length) {
      return res.json(invData);
    }
    next(new Error('No data returned'));
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id, 10);
    const nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);
    if (!itemData) {
      return next(new Error('Inventory item not found'));
    }
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render('inventory/edit-inventory', {
      title: 'Edit ' + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id:            itemData.inv_id,
      inv_make:          itemData.inv_make,
      inv_model:         itemData.inv_model,
      inv_year:          itemData.inv_year,
      inv_description:   itemData.inv_description,
      inv_image:         itemData.inv_image,
      inv_thumbnail:     itemData.inv_thumbnail,
      inv_price:         itemData.inv_price,
      inv_miles:         itemData.inv_miles,
      inv_colcr:         itemData.inv_colcr,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
