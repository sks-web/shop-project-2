//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const errorPage = require("./controllers/error");
mongoConnect = require("./util/database").mongoConnect;


const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    // User.findByPk(2)
    // .then(user => {
    //     req.user = user;
    //     next();
    // })
    // .catch(err => {
    //     console.log(err);
    // })
    next();
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorPage.get404);

mongoConnect(() => {
    app.listen(3000, () => {
        console.log("server is connected to port 3000!");
    });
});
