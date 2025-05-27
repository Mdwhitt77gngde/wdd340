const utlities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res){
    const nav = await utlities.getNav()
    res.render("index", {title: "Home", nav})
}

module.exports = baseController
