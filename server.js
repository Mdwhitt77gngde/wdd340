/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/index")
const session = require("express-session")
const pool = require("./database/") // Required by models
const accountRoute = require("./routes/accountRoute")

/* **************************
 * Session & Flash Middleware
 * **************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
)
app.use(require("connect-flash")())
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/* **************************
 * Body Parsers (built-in)
 * **************************/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory Routes
app.use("/inv", inventoryRoute)

// Account Routes
app.use("/account", accountRoute)

// File Not Found Route – must be last route
app.use(async (req, res, next) => {
  next({ status: 404, message: "sorry, we appear to have lost that page." })
})

/* ************************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const message =
    err.status === 404
      ? err.message
      : "oh no! There was a crash. Maybe try a different route?"
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
