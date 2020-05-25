//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const errorPage = require("./controllers/error");
const User = require("./models/user");


const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("5ec90d7736e352124c5099cb")
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    })
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorPage.get404);

mongoose.connect("mongodb://localhost:27017/shop", {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => {
    User.findOne()
    .then(user => {
        if(!user) {
            const user = new User({
                name: "Sachi Kanta Sahu",
                email: "sahu.sachikanta7@gmail.com",
                cart:{
                    items:[]
                }
            });
            user.save();
        }
    })
    .catch(err => {
        console.log(err)
    });
    app.listen(3000, () => {
        console.log("Server is connected to port 3000!");
    });
})
.catch(err => {
    console.log(err);
});
