//jshint esversion:6

const express = require("express");
const router = express.Router();
const userController = require("../controllers/shop");

router.get("/", userController.getIndex);

router.get("/product-list", userController.dispProduct);

// router.get("/cart", userController.getCart);

// router.post("/add-to-cart", userController.postCart);

// router.post("/cart-delete-item", userController.postCartDeleteProduct);

// router.get("/checkout", userController.getCheckout);

// router.get("/orders", userController.getOrders);

// router.post("/create-order", userController.postOrder);

router.get("/products/:productId", userController.getProduct);


module.exports = router;