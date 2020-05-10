//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const errorPage = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-items");
const Order = require("./models/order");
const OrderItems = require("./models/order-items");

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findByPk(2)
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

Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItems});


sequelize
// .sync({
//     force: true
// })
.sync()
.then(result => {
    return User.findByPk(1)
    console.log("Database connected");
})
.then(user => {
    if(!user){
        return User.create({name: "Sachi", mailId: "sahu.sachikanta7@gmail.com"});
    }
    return user;
})
.then(user => {
    user.createCart();
    
})
.catch(err => {
    console.log(err);
})

app.listen(3000, () => {
    console.log("Server start at PORT 3000");
})