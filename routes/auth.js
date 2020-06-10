// jshint esversion:6

const express = require("express");
const { check, body } = require("express-validator/check");
const router = express.Router();
const authController = require("../controllers/auth");
const User = require("../models/user");

router.get("/login", authController.getLogin);

router.post(
  "/login",
  body("email", "Please enter email").notEmpty(),
  body("email", "Please enter valid email Id!").isEmail().normalizeEmail(),
  body("password", "Please enter passsword").notEmpty(),
  body("password", "Please enter a password with alphabet and number only!")
    .isLength({ min: 5 })
    .isAlphanumeric(),
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  body("name", "Please enter your full name").notEmpty(),
  check("email")
    .isEmail()
    .trim()
    .normalizeEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("Email already present!");
        }
      });
    }),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 5 character"
  )
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("cpassword", "Fill the password confirm password!").notEmpty(),
  body("cpassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirm Password have to match!");
      }
      return true;
    })
    .trim(),
  authController.postSignup
);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/newPassword", authController.postNewPassword);

module.exports = router;
