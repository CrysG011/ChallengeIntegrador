const express = require("express");
const router = express.Router();
const controller = require("../../controllers/shop/shopController.js")

router.get("/", controller.getShopView) 

router.get("/item/:id", controller.getItemView)

router.post("/item/:id/add", controller.addToCart)

router.get("/cart", controller.getCartView)

router.post("/cart", controller.CreatePurchase)

module.exports = router 