//jshint esversion:6

const express = require("express");
const router = express.Router();
const userController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get("/", userController.getIndex);

router.get("/product-list", userController.dispProduct);

router.get("/cart",isAuth, userController.getCart);

router.post("/add-to-cart",isAuth, userController.postCart);

router.post("/cart-delete-item",isAuth, userController.postCartDeleteProduct);

// // router.get("/checkout",isAuth userController.getCheckout);

router.get("/orders",isAuth, userController.getOrders);

router.post("/create-order",isAuth, userController.postOrder);

router.get("/products/:productId", userController.getProduct);

router.get("/orders/:orderId", isAuth, userController.getInvoice);

module.exports = router;