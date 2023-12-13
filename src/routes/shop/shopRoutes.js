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
    //Anadir carrito en caso de que no exista
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
    //Usar carrito existente y sumar qty si existe el producto anadido  
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

    next();

  } else {
  next();
  } 
};

router.get("/", shopController.getShopView);

router.get("/item/:id", shopController.getItemView);

router.post("/item/:id/add", express.json(), isLoginCart, shopController.addToCart);

router.get("/cart", shopController.getCartView);

router.post("/cart", isLogin, shopController.CreatePurchase);

router.delete("/cart/delete/:id", shopController.deleteCart)

module.exports = router;
