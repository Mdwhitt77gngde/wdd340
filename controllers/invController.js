const invModel =require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************* */
invCont.buildByClassificationId = async function (req, res, next) {
const classification_id = parseInt(req.params.classification_Id)//parseInt(***)
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
    
}

/* ***************************
 * Build single vehicle detail view
 * ************************* */
invCont.buildDetail = async function (req, res, next) {
    const inv_id = req.params.inv_id;
    //const data = await invModel.getInventoryByClassificationId(inv_id);
    const data = await invModel.getInventoryById(inv_id);//check
    const vehicleName = `${data.inv_make} ${data.inv_model}`;
    let nav = await utilities.getNav();
    const vehicleHtml = utilities.buildVehicleDetailView(data);
    res.render("./inventory/vehicle-detail", {
        title: vehicleName,
        nav,
        vehicleHtml,
    })
}

module.exports = invCont