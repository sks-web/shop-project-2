// jshint esversion:6
const Product = require("../models/product");
const Order = require("../models/order");
// const User = require("../models/user");

//Get first page with all product details
exports.dispProduct = (req, res, next) => {
    Product.find()
    .then(products => {
        console.log("Data fetched");
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
    Product.find()
    .then(products => {
        console.log("Data fetched");
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
    .populate("cart.items.productId")
    .execPopulate()
    .then(products => {
        console.log("Cart fetched");
        res.render("shop/cart",{
            path: "/cart",
            pageTitle: "Your cart",
            product: products.cart.items
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
        console.log("Data added to cart!");
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
    .removeFromCart(prodId)
    .then(product => {
        console.log("Data Deleted from cart!");
        res.redirect("/cart");
    })
    .catch(err => {
        console.log(err);
    });
}

// // Placing order model
exports.postOrder = (req, res, next) => {
    req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(result => {
        const products = result.cart.items.map(i => {
            return {quantity: i.quantity, productData: {...i.productId._doc}}
        })
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            products: products
        });
        return order.save();
    })
    .then(result => {
        return req.user.clearCart();
    })
    .then(() => {
        res.redirect("/cart");
    })
    .catch(err => {
        console.log(err);
    })
}

// // Get all order for the page
exports.getOrders = (req, res, next) => {
    Order.find({"user.userId": req.user._id})
    .then(orders => {
        console.log("Order Fetched");
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
        console.log("Get Single product!");
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
