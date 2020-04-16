// jshint esversion:6
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.dispProduct = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render("shop/product-list", {
            pageTitle: "Product Page",
            path: "/products",
            productList: products
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render("shop/index", {
            pageTitle: "Product Page",
            path: "/",
            productList: products
        });
    })
    .catch(err => {
        console.log(err)
    });
    /*
    Product.fetchAll()
    .then(([rows]) => {
        
    })
    .catch(err => console.log(err));
    */
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
    Product.findAll({Where: {id: prodId}})
    .then(products => {
        res.render("shop/product-details",{
            product: products[0],
            pageTitle: products[0].title,
            path:"/products"
        }) 
    })
    .catch(err => {
        console.log(err);
    });
    // OR
    /*
    Product.findByPk(prodId)
    .then(products => {
        res.render("shop/product-details",{
            product: products,
            pageTitle: "Porduct Detials",
            path:"/products"
        }) 
    })
    .catch(err => console.log(err));
    */
}
