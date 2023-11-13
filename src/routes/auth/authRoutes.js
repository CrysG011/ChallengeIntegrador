const express = require("express");
const router = express.Router();
const controller = require("../../controllers/auth/authController.js")

router.get("/login", controller.getLoginView);

router.post("/login", controller.verifyLogin);

router.get("/register", controller.getRegisterView);

router.post("/register", controller.verifyRegister);

router.get("/logout", controller.verifyLogout)

module.exports = router