const getShopView = (req, res) => {
    res.render("shop")
}

const getItemView = (req, res) => {
    res.render(`item`)
}

const addToCart = (req, res) => {
    res.send(`Añadir producto ${req.params.id} al carrito`)
}

const getCartView = (req, res) => {
    res.render("carro")
}

const CreatePurchase = (req, res) => {
    res.send("Confirmar compra")
}

module.exports = {
    getShopView,
    getItemView,
    addToCart,
    getCartView,
    CreatePurchase
}