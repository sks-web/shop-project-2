const Product = require("../models/product");

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
    const product = new Product(null, title, imageUrl, description, price);
    product.save()
    .then(() => {
        res.redirect("/");
    })
    .catch( err => console.log(err) );
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            res.redirect("/");
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product Page",
            path: "/admin/editProduct",
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    console.log("hi this is posteditproduct");
    
    const prodID = req.body.productId;
    const updatedTitle = req.body.productName;
    const updatePrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(prodID, updatedTitle, updatedImageUrl, updatedDesc, updatePrice);
    updatedProduct.save();
    res.redirect("/admin/product");
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([rows]) => {
        res.render("admin/product", {
            pageTitle: "Admin Products",
            path: "admin/products",
            productList: rows
        });
    })
    .catch(err => console.log(err) );
}

exports.getDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect("/admin/product");
}