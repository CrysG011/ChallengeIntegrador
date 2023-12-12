const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");

const model = require("../../models/User")
const modelCart = require("../../models/Cart")

const getLoginView = (req, res) => {
   if (!req.session.userId){
   res.render("login", {req});
   } else {
      res.send("Ya estás ingresado!")
   }
}

const verifyLogin = async (req, res) => {

   const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return res.render("login", {
            values: req.body,
            errors: errors.array(),
            req
         });
      }
   
      try {
         const user = await model.findOne({
            where: {
               email: req.body.email,
            }
         });
         
         if(!user) {
            res.render("login", {
               values: req.body,
               errors: [{msg: "El correo y/o la contraseña son incorrectos"}],
               req
            });
         } else if (!(await bcryptjs.compare(req.body.password, user.password))) {
            res.render("login", {
               values: req.body,
               errors: [{msg: "El correo y/o la contraseña son incorrectos"}],
               req
         });
         } else {

            req.session.userId = user.id;
            if (req.session.userId) {
               if (req.session.cart && req.session.cart.items) {
                  for (const item of req.session.cart.items) {
                        const existingCartEntry = await modelCart.findOne({
                           where: {
                           userId: user.id,
                           productId: item.ProductId,
                           },
                        });
                     
                        if (existingCartEntry) {
                           existingCartEntry.quantity += +item.quantity;
                           await existingCartEntry.save();
                        } else {
                           try {
                              const cart = await modelCart.create({
                              quantity: item.quantity,
                              UserId: user.id,
                              ProductId: item.ProductId,
                              });
                           }
                           catch {
                              console.log("no se creó un carrito")
                           }
                           }
                  };
      
               }
            }
            const returnTo = req.session.returnTo || '/';
            req.session.returnTo = null;
            return res.redirect(returnTo);
         }
      }
       catch (error) {
         res.send(error)
         console.log(error)
      }
};

const getRegisterView = (req, res) => {
    res.render("register", {req});
};
 const verifyRegister = async (req, res) => {
   const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render("register", {
            values: req.body,
            errors: errors.array(),
            req
        });
    }
   
    try {
       const user = await model.create(req.body);
       res.redirect("/")
    } catch (error) {
      res.send(error)
      console.log(error)
    }
};

 const verifyLogout = (req, res) => {
   res.clearCookie('session');
    res.redirect("/");
};

 module.exports = {
    getLoginView,
    verifyLogin,
    getRegisterView,
    verifyRegister,
    verifyLogout
 }