// utilities/index.js
const invModel = require('../models/inventory-model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Util = {};

/* **************************
 * Constructs the nav HTML unordered list
 **************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications();
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
  });
  list += '</ul>';
  return list;
};

/* ***************************************
 * Build classification select list HTML
 **************************************** */
Util.buildClassificationList = async function (selectedId = null) {
  const data = await invModel.getClassifications();
  let list = '<select name="classification_id" id="classificationList" required>';
  list += '<option value="">Choose a Classification</option>';
  data.rows.forEach((row) => {
    const sel = selectedId && row.classification_id === +selectedId ? ' selected' : '';
    list += `<option value="${row.classification_id}"${sel}>${row.classification_name}</option>`;
  });
  list += '</select>';
  return list;
};

/* ***************************************
 * Build the classification grid HTML
 **************************************** */
Util.buildClassificationGrid = async function (vehicles) {
  let grid = '';
  if (vehicles.length) {
    grid = '<ul id="inv-display">';
    vehicles.forEach((v) => {
      let thumb = v.inv_thumbnail.startsWith('/images/vehicles/')
        ? v.inv_thumbnail
        : `/images/vehicles/${v.inv_thumbnail}`;
      grid += `<li>
          <a href="/inv/detail/${v.inv_id}" title="View ${v.inv_make} ${v.inv_model} details">
            <img src="${thumb}" alt="Thumbnail of ${v.inv_make} ${v.inv_model}">
          </a>
          <div class="namePrice">
            <hr/>
            <h2>
              <a href="/inv/detail/${v.inv_id}" title="View ${v.inv_make} ${v.inv_model} details">
                ${v.inv_make} ${v.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat('en-US').format(v.inv_price)}</span>
          </div>
        </li>`;
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles found.</p>';
  }
  return grid;
};

/* ***************************************
 * Build the vehicle detail HTML
 **************************************** */
Util.buildVehicleDetailView = function (vehicle) {
  let imgPath = vehicle.inv_image.startsWith('/images/vehicles/')
    ? vehicle.inv_image
    : `/images/vehicles/${vehicle.inv_image}`;
  let view = `<section id="vehicle-detail">
      <img src="${imgPath}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <div class="vehicle-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <h3>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</h3>
        <ul>
          <li><strong>Year:</strong> ${vehicle.inv_year}</li>
          <li><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</li>
          <li><strong>Description:</strong> ${vehicle.inv_description}</li>
        </ul>
      </div>
    </section>`;
  return view;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies?.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, acc) => {
      if (err) {
        req.flash('notice', 'Please log in');
        res.clearCookie('jwt');
        return res.redirect('/account/login');
      }
      res.locals.accountData = acc;
      res.locals.loggedin = 1;
      next();
    });
  } else {
    next();
  }
};

/* ***************************************
 * Check that user is logged in
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    return next();
  }
  req.flash('notice', 'Please log in.');
  return res.redirect('/account/login');
};

/* ***************************************
 * General Error Handler wrapper
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
