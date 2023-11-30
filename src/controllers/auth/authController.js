const { validationResult } = require("express-validator");

const getLoginView = (req, res) => {
    res.render("login");
}

 const verifyLogin = (req, res) => {
    res.send("Verificar login");
}

 const getRegisterView = (req, res) => {
    res.render("register");
}

 const verifyRegister =  (req, res) => {
   const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render("register", {
            values: req.body,
            errors: errors.array(),
        });
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