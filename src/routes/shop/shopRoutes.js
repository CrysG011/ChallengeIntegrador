const express = require("express");
const router = express.Router();
const shopController = require("../../controllers/shop/shopController");

const isLogin = (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect("../auth/login");
    }
  
    next();
  };

router.get("/", shopController.getShopView);

router.get("/item/:id", shopController.getItemView);

router.post("/item/:id/add", isLogin, shopController.addToCart);

router.get("/cart", isLogin, shopController.getCartView);

router.post("/cart", isLogin, shopController.CreatePurchase);

module.exports = router;
