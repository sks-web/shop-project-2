//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const errorPage = require("./controllers/error");
const sequelize = require("./util/database");

/*
db.execute("SELECT * FROM products")
.then( result => {
    console.log(result[0]);
})
.catch( err => {
    console.log(err);
});
*/
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorPage.get404);

sequelize.sync().then(result => {
    console.log(result);
})
.catch(err => {
    console.log(err);
})

app.listen(3000, () => {
    console.log("Server start at PORT 3000");

})