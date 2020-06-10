//jshint esversion:6

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const { body, check } = require("express-validator/check");
const isAuth = require("../middleware/is-auth");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/product", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post(
  "/add-product",
    check("productName", "Provide proper title!").isString().isLength({min: 3}),
    body("price").isFloat(),
    body("description","Please provide description!").isLength({min: 5, max: 30}),
  isAuth,
  adminController.addProduct
);

router.post("/delete-product", isAuth, adminController.getDeleteProduct);

module.exports = router;
