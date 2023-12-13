const Sequelize = require('sequelize');

const model = require("../../models/Product");
const modelCart = require("../../models/Cart");
const modelUser = require("../../models/User");
const modelCategory = require("../../models/Category");

const getShopView = async (req, res) => {

  try {
    const categoriasDb = await modelCategory.findAll();
    let productos
    if(req.query.categoria){
      let categoria = +req.query.categoria
  
      productos = await model.findAll({
        where: {
          CategoryId: categoria
        }
      });
    } else {
      productos = await model.findAll();
    } 

    res.render("shop", { productos, categoriasDb, req });   
  } catch (error) {
    console.log(error)
  }
};

const getItemView = async (req, res) => {
  
  try {
    
    const producto = await model.findByPk(req.params.id);
    
    if(producto){
      const categoria = await modelCategory.findOne({
         where: {
          id: producto.CategoryId
         }
        });

      const productosRelacionados = await model.findAll({
        where: {
          CategoryId: producto.CategoryId,
          id: {
            [Sequelize.Op.not]: producto.id
          }
        }
      });

      res.render("item", {
        producto, categoria, productosRelacionados, req
      });   
    } else {
      res.send("El producto no existe")
    }
  } catch (error) {
    console.log(error);
  }
};

const addToCart = async (req, res) => {
  try {
        const user = await modelUser.findByPk(req.session.userId);
        
        if (!user && req.session.cart) {
          console.log("agregar al carrito fantasma")
        } else {
            const existingCartEntry = await modelCart.findOne({
              where: {
                userId: user.id,
                productId: req.params.id,
              },
            });
        
            if (existingCartEntry) {
              existingCartEntry.quantity += +req.body.quantity;
              await existingCartEntry.save();
            } else {
            const cart = await modelCart.create(
              {
                quantity: req.body.quantity,
                UserId: user.id,
                ProductId: req.params.id,
              }
              );
            }
        }

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.send(error);
  }

};

const getCartView = async (req, res) => {
  try {
    let user;
    let alreadySentRender = false;


    if (req.session.userId){
    user = await modelUser.findByPk(req.session.userId);
    }

    if (!user && !req.session.cart || req.session.cart.items == 0) {
      console.log("ENTRO AL !USER BLABLA")
        const categorias = await modelCategory.findAll()
      
        const productosRecientes = await model.findAll({
          order: [['createdAt', 'DESC']],
          limit: 6
        });
      
        res.render("emptyCart", {productosRecientes, categorias, req});
        alreadySentRender = true;
    } else {
      let productsTotalQty = 0;
      let subTotalPrice = 0;
      const productos = []
      let envioPrice = 0;
      let productsInCart
        if (!user && req.session.cart) {
          for (const item of req.session.cart.items) {
            productsInCart = req.session.cart.items
            productsTotalQty += item.quantity;

            const producto = await model.findByPk(item.ProductId);    
            if (producto) {
              productos.push(producto);
              subTotalPrice += producto.price * item.quantity;
            }
          }
        } else if (user) {
              productsInCart = await modelCart.findAll({
                where: {
                  UserId: user.id,
                }});
        
              for (i=0; i<productsInCart.length; i++) {
                const producto = await model.findByPk(productsInCart[i].ProductId);
                if (producto){
                productos.push(producto)
                subTotalPrice += producto.price * productsInCart[i].quantity
                productsTotalQty += productsInCart[i].quantity
                }
              }
          }
      res.render("carro", {productsInCart, productos, productsTotalQty, subTotalPrice, envioPrice, req}); 
      }
  }
  catch (error) {
    console.log("ocurrió un error", error)
  }
};

const CreatePurchase = (req, res) => {
  res.send("Confirmar compra");
};

const deleteCart = async (req, res) => {

  let deleteGroup = req.body.deleteType;

  if(deleteGroup == "all"){
    try {
      if(!req.session.userId && req.session.cart || !user && !req.session.cart.items){
        const item = (req.session.cart.items.findIndex((item) => (item.ProductId == req.params.id)))
          if (item != -1){
            req.session.cart.items.splice(item, 1);
            if (req.session.cart.items.length === 0){
              const categorias = await modelCategory.findAll()
              const productosRecientes = await model.findAll({
                order: [['createdAt', 'DESC']],
                limit: 6
              });
            
              res.render("emptyCart", {productosRecientes, categorias, req});

            } else {
              res.redirect("/shop/cart")
            }
          } else {
            res.send("Ha ocurrido un error")
          }
      } else if (req.session.userId) {
        const cart = await modelCart.destroy({
            where: {
                UserId: req.session.userId,
                ProductId: req.params.id
            }})
        res.redirect("/shop/cart")
      }  
    } catch (error) {
      res.send("Ha ocurrido un error: ", error)
      console.log("Ha ocurrido un error: ", error)
    }
  }
  else {
    //Manejar cuando eliminan productos individuales y mueven el qty
    res.send("Manejar cuando eliminan productos individuales")
    console.log("Manejar cuando eliminan productos individuales")
  }
}

module.exports = {
  getShopView,
  getItemView,
  addToCart,
  getCartView,
  CreatePurchase,
  deleteCart
};
