const Sequelize = require('sequelize');

const model = require("../../models/Product");
const modelCart = require("../../models/Cart");
const modelUser = require("../../models/User");
const modelCategory = require("../../models/Category");

const getShopView = async (req, res) => {

  console.log("REQ QUERY CATEGORIA ES: ", req.query.categoria)
  console.log(typeof +req.query.categoria);

  
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

    res.render("shop", { productos, categoriasDb });   
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
        producto, categoria, productosRelacionados
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
        
        if (!user) {
          return res.status(400).send('Tu usuario no se encuentra registrado');
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
    
    // estaría bueno que fuera el carrito desplegable o que aparezca un cartel temporal
    // que diga "producto añadido al carrito"
    res.send("producto añadido al carrito")

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

    if (!user && !req.session.cart) {
        const categorias = await modelCategory.findAll()
      
        const productosRecientes = await model.findAll({
          order: [['createdAt', 'DESC']],
          limit: 12
        });
      
        res.render("emptyCart", {productosRecientes, categorias});
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
      res.render("carro", {productsInCart, productos, productsTotalQty, subTotalPrice, envioPrice}); 
      }
  }
  catch (error) {
    console.log("ocurrió un error", error)
  }
};

const CreatePurchase = (req, res) => {
  res.send("Confirmar compra");
};

module.exports = {
  getShopView,
  getItemView,
  addToCart,
  getCartView,
  CreatePurchase,
};
