const model = require("../../models/Product");
const modelCart = require("../../models/Cart");
const modelUser = require("../../models/User");
const modelCategory = require("../../models/Category");

const getShopView = async (req, res) => {
  try {
    const productos = await model.findAll();
    const categoriasDb = await modelCategory.findAll();
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
          CategoryId: producto.CategoryId
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
      console.log("este es el req body: ", req.body)
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
      const user = await modelUser.findByPk(req.session.userId);
    
      if (!user) {
        return res.status(400).send('El usuario no existe');
      } 
    
      const productsInCart = await modelCart.findAll({
        where: {
          UserId: user.id,
        }});
    
      let productsTotalQty = 0;
      let subTotalPrice = 0;
      const productos = []
      let envioPrice = 0;

      for (i=0; i<productsInCart.length; i++) {
        const producto = await model.findByPk(productsInCart[i].ProductId);
        productos.push(producto) 

        subTotalPrice += producto.price * productsInCart[i].quantity
        productsTotalQty += productsInCart[i].quantity
      }
      res.render("carro", {productsInCart, productos, productsTotalQty, subTotalPrice, envioPrice}); 
  } catch (error) {
    res.send(error)
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
