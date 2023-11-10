const express = require("express");
const router = express.Router();
const controller = require("../controllers/mainController")

router.get("/", controller.index);

router.get("/contact", (req, res) => {
    res.render("contacto")
});

router.get("/about", (req, res) => {
    res.send("About")
});
 
router.get("/faqs", (req, res) => {
    res.send("Faqs")
});

module.exports = router;
