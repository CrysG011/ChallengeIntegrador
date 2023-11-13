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
    res.send("Comprobar registro");
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