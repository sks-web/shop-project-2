// jshint esversion:6
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.dispProduct = (req, res, next) => {
    Product.fetchAll()
    .then(([rows]) => {
        res.render("shop/product-list", {
            pageTitle: "Product Page",
            path: "/products",
            productList: rows
        });
    })
    .catch(err => console.log(err) );
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(([rows]) => {
        res.render("shop/index", {
            pageTitle: "Product Page",
            path: "/",
            productList: rows
        });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {   
    Cart.getProducts(cart => {
        Product.fetchAll(products => {
            const cartProduct = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id)     
                if(cartProductData) {
                    cartProduct.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render("shop/cart",{
                path: "/cart",
                pageTitle: "Your cart",
                product: cartProduct
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect("/");
    
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect("/cart");
    })
}

exports.getOrders = (req, res, next) => {
    res.render("shop/orders",{
        path: "/orders",
        pageTitle: "Your Order"
    })
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout",{
        path:"/checkout",
        pageTitle: "Checkout"
    })
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(([rows]) => {
        res.render("shop/product-details",{
            product: rows,
            pageTitle: "Porduct Detials",
            path:"/products"
        }) 
    })
    .catch(err => console.log(err));
}
