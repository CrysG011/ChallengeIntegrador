const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const { body } = require("express-validator");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

app.use(require("./src/routes/mainRoutes.js"));

app.use("/admin", require("./src/routes/admin/productsRoutes.js"));

app.use("/shop", require("./src/routes/shop/shopRoutes.js"));

app.use("/auth", require("./src/routes/auth/authRoutes.js"));

app.use((req, res, next) => {
  res.status(404).send("La página no existe");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("http://localhost:${PORT}"));
