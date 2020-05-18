// jshint esversion:6
const Product = require("../models/product");
// const User = require("../models/user");

//Get first page with all product details
exports.dispProduct = (req, res, next) => {
    Product.fetchAll()
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

// Get the first page
exports.getIndex = (req, res, next) => {
    Product.fetchAll()
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
};

//Get the cart page.
exports.getCart = (req, res, next) => { 

    req.user
    .getCart()
    .then(products => {
        res.render("shop/cart",{
            path: "/cart",
            pageTitle: "Your cart",
            product: products
        });
    })
    .catch(err => {
        console.log(err);
    });
};

// Insert into the cart 
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        res.redirect("/cart");
    })
    .catch(err => {
        console.log(err);
    });
 
}

// // Delete from cart
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
    .deleteItemFromCart(prodId)
    .then(product => {
        res.redirect("/cart");
    })
    .catch(err => {
        console.log(err);
    });
}

// // Placing order model
exports.postOrder = (req, res, next) => {

    req.user
    .addOrder()
    .then(result => {
        console.log("Placed orders");
        res.redirect("/cart");
    })
    .catch(err => {
        console.log(err);
    });

}

// // Get all order for the page
exports.getOrders = (req, res, next) => {
    req.user
    .getOrders()
    .then(orders => {
        res.render("shop/orders",{
            path: "/orders",
            pageTitle: "Your Order",
            data: orders
        });
    })
    .catch(err => {
        console.log(err);
    })


};

// // Get Checkout Page
// exports.getCheckout = (req, res, next) => {
//     res.render("shop/checkout",{
//         path:"/checkout",
//         pageTitle: "Checkout"
//     })
// }


// Get single Products
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(prodId);
    Product.findById(prodId)
    .then(result => {
        console.log(result);
        res.render("shop/product-details",{
            product: result,
            pageTitle: result.title,
            path:"/products"
        })
    })
    .catch(err => {
        console.log(err);
    });
}
