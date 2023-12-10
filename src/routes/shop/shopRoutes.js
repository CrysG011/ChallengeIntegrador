const express = require("express");
const router = express.Router();
const shopController = require("../../controllers/shop/shopController");

  const isLogin = (req, res, next) => {
    if (!req.session.userId) {
      req.session.returnTo = req.originalUrl;
      return res.redirect("/auth/login");
    } else {
      next();
    }
  };

const isLoginCart = (req, res, next) => {
  const qty = parseInt(req.body.quantity)
  if (!req.session.userId) {
    if (!req.session.cart) {
    const cart = {
      items: []
    }
    req.session.cart = cart;   

    req.session.cart.items.push({
      ProductId: req.params.id,
      quantity: qty
    })
  } else {
    const item = (req.session.cart.items.findIndex((item) => (item.ProductId == req.params.id)))
    if (item != -1){
      req.session.cart.items[item].quantity = parseInt(req.session.cart.items[item].quantity) + parseInt(req.body.quantity);
    } else {
      req.session.cart.items.push({
        ProductId: req.params.id,
        quantity: qty
      })
    }
  }

  console.log("ITEMS ACTUALES: ", req.session.cart.items)
  // que aparezca cartelito de "producto añadido al carrito"
  return res.send("producto añadido al carrito fantasma");

} else {
  next();
}
 };


router.get("/", shopController.getShopView);

router.get("/item/:id", shopController.getItemView);

router.post("/item/:id/add", isLoginCart, shopController.addToCart);

router.get("/cart", shopController.getCartView);

router.post("/cart", isLogin, shopController.CreatePurchase);

module.exports = router;
