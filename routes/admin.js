//jshint esversion:6

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

router.get("/add-product", adminController.getAddProduct);

router.get("/product", adminController.getProducts);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

router.post("/add-product", adminController.addProduct);

router.post("/delete-product", adminController.getDeleteProduct);


module.exports = router;