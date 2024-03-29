const express = require("express");
const { check, body } = require("express-validator/check");
const bcrypt = require("bcryptjs");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  check("email", "Invalid email.")
    .isEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (!user) {
          return Promise.reject("Invalid email.");
        }

        req.user = user;

        return true;
      });
    })
    .normalizeEmail(),
  check("password", "Invalid password.").isLength({ min: 5 }).trim(),
  authController.postLogin
);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Invalid email address!")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((foundUser) => {
        if (foundUser) {
          return Promise.reject("Email already in use.");
        }
      });
    })
    .normalizeEmail(),
  body("password", "Invalid password.")
    .isLength({ min: 5, max: 25 })
    .isAlphanumeric()
    .trim(),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match!");
      }

      return true;
    }),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
