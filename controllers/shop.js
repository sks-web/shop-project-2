// jshint esversion:6
const fs = require("fs");
const Product = require("../models/product");
const Order = require("../models/order");
const path = require("path");
const PDFDocument = require("pdfkit");
const { v4 } = require("uuid");

//Get first page with all product details
exports.dispProduct = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log("Data fetched");
      res.render("shop/product-list", {
        pageTitle: "Product Page",
        path: "/products",
        productList: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Get the first page
exports.getIndex = (req, res, next) => {
  let message = req.flash("success");
  let msg = null;
  if (message.length > 0) {
    msg = message[0];
  }
  console.log(v4().toString().replace("-", ""));
  Product.find()
    .then((products) => {
      console.log("Data fetched");
      res.render("shop/index", {
        pageTitle: "Product Page",
        path: "/",
        productList: products,
        successMessage: msg,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//Get the cart page.
exports.getCart = (req, res, next) => {
  req.user
    // req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((products) => {
      console.log("Cart fetched");
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your cart",
        product: products.cart.items,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Insert into the cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("Data added to cart!");
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// // Delete from cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((product) => {
      console.log("Data Deleted from cart!");
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// // Placing order model
exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((result) => {
      const products = result.cart.items.map((i) => {
        return { quantity: i.quantity, productData: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// // Get all order for the page
exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log("Order Fetched");
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Order",
        data: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .then((result) => {
      console.log("Get Single product!");
      res.render("shop/product-details", {
        product: result,
        pageTitle: result.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found."));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorised"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);
      console.log(invoicePath);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline; filename = '" + invoiceName + "'"
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("---------------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
          totalPrice += prod.quantity * prod.productData.price;
        pdfDoc.fontSize(14).text(
          prod.productData.title +
            " - " +
            prod.quantity +
            " x " +
            " Rs. " +
            prod.productData.price
        );
      });
      pdfDoc.text("Total Price: Rs. " + totalPrice);

      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //     if(err) {
      //         return next(err);
      //     }
      //     res.setHeader("Content-Type","application/pdf");
      //     res.setHeader("Content-Disposition", "inline; filename = '"+ invoiceName + "'" );
      //     res.send(data);
      // })
      const file = fs.createReadStream(invoicePath);

      file.pipe(res);
    })
    .catch((err) => {
      next(err);
    });
};
