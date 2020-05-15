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
// exports.getCart = (req, res, next) => { 

//     User.findByPk(1)
//     .then(user => {
//         return user.getCart();
//     })
//     .then(cart => {
//         return cart.getProducts();
//     })
//     .then(products => {
//         res.render("shop/cart",{
//             path: "/cart",
//             pageTitle: "Your cart",
//             product: products
//         });
//     })
//     .catch(err => {
//         console.log(err);
//     });
// };

// // Insert into the cart 
// exports.postCart = (req, res, next) => {
//     const prodId = req.body.productId;
//     let fetchedCart;
//     let newQuantity = 1;
//     User.findByPk(1)
//     .then(user => {
//         return user.getCart();
//     })
//     .then(cart => {
//         fetchedCart = cart;
//         return cart.getProducts({where:{id: prodId}});
//     })
//     .then(products => {
//         let prod = products[0];
//         if(prod){
//             let oldQuantity = prod.cartItem.quantity;
//             newQuantity = oldQuantity+1;
//             return products;
//         }

//         return Product.findByPk(prodId);
//     })
//     .then((product) => {
//         return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
//     })
//     .then(() => {
//         res.redirect("cart");
//     })
//     .catch(err => {
//         console.log(err);
//     });
 
// }

// // Delete from cart
// exports.postCartDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     User.findByPk(1)
//     .then((user) => {
//         return user.getCart();
//     })
//     .then(cart => {
//         return cart.removeProducts(prodId);
//     })
//     .then(product => {
//         res.redirect("/cart");
//     })

//     .catch(err => {
//         console.log(err);
//     });
// }

// // Placing order model
// exports.postOrder = (req, res, next) => {
//     let fetchedCart = null;
//     User.findByPk(1)
//   .then(user => {
//     return user.getCart();
//   })
//   .then(cart =>{
//     fetchedCart = cart;
//     return cart.getProducts();
//   })
//   .then(products => {
//     return User.findByPk(1)
//     .then(user => {
//       return user.createOrder()
//       .then(order => {
//         return order.addProducts(
//           products.map(product => {
//             product.orderItem = { quantity: product.cartItem.quantity };
//             return product;
//           })
//         )
//       })
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   })
//   .then(result => {
//     return fetchedCart.setProducts(null);
//   })
//   .then(result => {
//     res.redirect("order");
//   })
//   .catch(err => {
//     console.log(err);
//   });
// }

// // Get all order for the page
// exports.getOrders = (req, res, next) => {
//     User.findByPk(1)
//     .then(user => {
//         return user.getOrders({include: ["products"]})
//     })
//     .then(orders => {
//         orders.forEach(order => {
//         });
//         res.render("shop/orders",{
//             path: "/orders",
//             pageTitle: "Your Order",
//             data: orders
//         });
//     })
//     .catch(err => {
//         console.log(err);
//     });
// };

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
