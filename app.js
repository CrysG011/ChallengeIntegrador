const express = require("express");
const app = express();
const methodOverride = require("method-override");
/*El process.env.PORT detecta la url de Vercel */
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.use("/", require("./src/routes/mainRoutes.js"));

app.use("/admin", require("./src/routes/admin/productsRoutes.js"));

app.use("/shop", require("./src/routes/shop/shopRoutes.js"));

app.use("/auth", require("./src/routes/auth/authRoutes.js"));

app.use((req, res, next) => {
  res.status(404).send("La página no existe");
});

app.listen(port, () => {
  console.log("http://localhost:${port}");
});
