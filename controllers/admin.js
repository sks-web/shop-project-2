const Product = require("../models/product");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product Page",
        path: "/admin/addProduct",
        editing: false
    });
};

exports.addProduct = (req, res, next) => {
    const title = req.body.productName;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    product.save()
    .then(result =>{
        console.log("Data Added");
        res.redirect("/admin/product");
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                res.redirect("/");
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product Page",
                path: "/admin/editProduct",
                editing: editMode,
                product: product
            });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postEditProduct = (req, res, next) => {
    const prodID = req.body.productId;
    const updatedTitle = req.body.productName;
    const updatePrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const product = new Product(updatedTitle, updatePrice, updatedDesc, updatedImageUrl, new ObjectId(prodID));
    product.save()
    .then(result => {
        console.log("Data updated");
        res.redirect("/admin/product")
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(product => {
        console.log("Data Fetched");
        res.render("admin/product", {
            pageTitle: "Admin Products",
            path: "admin/products",
            productList: product
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
    .then(result => {
        console.log("Data Deleted");
        res.redirect("/admin/product");
    })
    .catch(err => {
        console.log(err);
    });
}