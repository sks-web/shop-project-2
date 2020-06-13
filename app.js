//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStore =require("connect-mongodb-session")(session);//passing of session to mongdb session
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const {v4} = require("uuid");


const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const errorPage = require("./controllers/error");
const User = require("./models/user");
const app = express();

// createing Session
const store = new mongoDBStore({
    uri: "mongodb://localhost:27017/shop",
    collection: "session"
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, v4().toString().replace("-","") + "-" + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        cb(null, true);
    } else {
        cb(null, false);
    }
}


app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(multer({storage:fileStorage, fileFilter: fileFilter}).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(session({secret: "my secret", resave: false, saveUninitialized:false, store: store}));
app.use(flash());

app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});


app.use((req, res, next) => {
    if(req.session.user){
        User.findById(req.session.user._id)
        .then(user => {
            if(!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
    } else {
        next();
    }
});


app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.get("/500", errorPage.get500);

app.use(errorPage.get404);

app.use((error, req, res, next) => {
    console.log(error);
    res.status(505).render("500", {
        pageTitle: "Error!",
        path: "/500",
        isAuthenticated: req.session.isLoggedIn
    });
});

mongoose.connect("mongodb://localhost:27017/shop", {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => {
    app.listen(3000, () => {
        console.log("Server is connected to port 3000!");
    });
})
.catch(err => {
    console.log(err);
});
