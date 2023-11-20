const express = require("express");
const router = express.Router();
const shopController = require("../../controllers/shop/shopController");

router.get("/", shopController.getShopView);

router.get("/item/:id", shopController.getItemView);

router.post("/item/:id/add", shopController.addToCart);

router.get("/cart", shopController.getCartView);

router.post("/cart", shopController.CreatePurchase);

module.exports = router;
