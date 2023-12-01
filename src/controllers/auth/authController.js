const { validationResult } = require("express-validator");

const model = require("../../models/User")

const getLoginView = (req, res) => {
    res.render("login");
}

 const verifyLogin = (req, res) => {
    res.send("Verificar login");
}

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