const express = require("express");
const { body } = require('express-validator');
const router = express.Router();
const User = require("../../models/user");
const authController = require("../../controllers/auth/auth");

router.post(
  "/signup",
  [
    body("userName").trim().notEmpty(),

    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((email, { req }) => {
        return User.findOne({ email: email }).then((us) => {
          if (us) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),

    body("password").trim().isLength({ min: 8 }),
    
  ],
  authController.signUp
);

router.post("/login", authController.login);

router.post("/emailVerify",authController.verify);

module.exports = router;


