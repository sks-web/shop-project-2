//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const errorPage = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");


const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("5ebea2420879225008f7be83")
    .then(user => {
        req.user = new User(user.username, user.email, user.cart, user._id);
        next();
    })
    .catch(err => {
        console.log(err);
    })
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorPage.get404);

mongoConnect(() => {
    app.listen(3000, () => {
        console.log("server is connected to port 3000!");
    });
});
