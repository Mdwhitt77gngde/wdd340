// utilities/index.js

const invModel = require("../models/inventory-model")
const Util = {}

/* **************************
 * Constructs the nav HTML unordered list
 **************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data) // ← FIX: added for debugging
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ***************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "" // ← FIX: Always initialize
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += "<li>"

      // ← FIX: Determine thumbnail path; if it already starts with "/images/vehicles/", use as-is.
      let thumbPath = vehicle.inv_thumbnail
      if (!thumbPath.startsWith("/images/vehicles/")) {
        thumbPath = "/images/vehicles/" + thumbPath
      }

      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        '<img src="' +
        thumbPath + // ← FIX: use the computed thumbPath
        '" alt="Thumbnail of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        '" /></a>'

      grid += '<div class="namePrice">'
      grid += "<hr />"
      grid += "<h2>"
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>"
      grid += "</h2>"
      grid +=
        '<span>$' +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>"
      grid += "</div>"
      grid += "</li>"
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles found.</p>' // ← FIX: assign string, not append
  }
  return grid
}

/* ***************************************
 * Build the vehicle detail HTML
 * ************************************ */
Util.buildVehicleDetailView = function (vehicle) {
  let detailView = '<section id="vehicle-detail">' // wrapper for CSS

  // ← FIX: Determine full-size image path; if it already starts with "/images/vehicles/", use as-is.
  let imagePath = vehicle.inv_image
  if (!imagePath.startsWith("/images/vehicles/")) {
    imagePath = "/images/vehicles/" + imagePath
  }

  detailView +=
    `<img src="${imagePath}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`

  detailView += `<div class="vehicle-info">`
  detailView += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`

  // Price with U.S. dollars and comma separators
  detailView +=
    `<h3>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</h3>`

  detailView += `<ul>`
  detailView += `<li><strong>Year:</strong> ${vehicle.inv_year}</li>`

  // Mileage with comma separators and “miles”
  detailView +=
    `<li><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(
      vehicle.inv_miles
    )} miles</li>`

  detailView += `<li><strong>Description:</strong> ${vehicle.inv_description}</li>`
  detailView += `</ul></div></section>`

  return detailView
}

/* ***************************************
 * Middleware For Handling Errors
 * Wrap other functions in this for 
 * General Error Handling
 * ************************************ */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
