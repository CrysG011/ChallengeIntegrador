const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");

const model = require("../../models/User")

const getLoginView = (req, res) => {
    res.render("login");
}
const verifyLogin = async (req, res) => {
   const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return res.render("login", {
            values: req.body,
            errors: errors.array(),
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
            });
         } else if (!(await bcryptjs.compare(req.body.password, user.password))) {
            res.render("login", {
               values: req.body,
               errors: [{msg: "El correo y/o la contraseña son incorrectos"}],
         });
         } else {
            //estoy trabajando la parte de login y sesion
            res.send("login")
         }
      }
       catch (error) {
         res.send(error)
         console.log(error)
      }
   };

 const getRegisterView = (req, res) => {
    res.render("register");
}
 const verifyRegister = async (req, res) => {
   const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render("register", {
            values: req.body,
            errors: errors.array(),
        });
    }
   
    try {
       const user = await model.create(req.body);
       res.redirect("/")
    } catch (error) {
      res.send(error)
      console.log(error)
    }
}

 const verifyLogout = (req, res) => {
    res.send("Logout")
}


 module.exports = {
    getLoginView,
    verifyLogin,
    getRegisterView,
    verifyRegister,
    verifyLogout
 }