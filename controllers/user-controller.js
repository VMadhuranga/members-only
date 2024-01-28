const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const UserModel = require("../models/user-model");

const userSignUpGet = (req, res) => {
  res.render("signup-form-view", {
    title: "Sign up",
  });
};

const userSignUpPost = [
  body("first-name", "First name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last-name", "Last Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("user-name", "User Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (value) => {
      const exitingUser = await UserModel.findOne({
        userName: value,
      });
      if (exitingUser) {
        throw new Error("User Name already exists");
      }
    }),
  body("password", "Password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirm-password", "Passwords not match")
    .trim()
    .escape()
    .custom((value, { req }) => value === req.body.password),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new UserModel({
      firstName: req.body["first-name"],
      lastName: req.body["last-name"],
      userName: req.body["user-name"],
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.render("signup-form-view", {
        title: "Sign up",
        errors: errors.array(),
        confirmPassword: req.body["confirm-password"],
        user,
      });
    } else {
      bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
        if (err) {
          throw new Error(err);
        }

        user.password = await hashedPassword;
        await user.save();
        res.redirect("/login");
      });
    }
  }),
];

module.exports = {
  userSignUpGet,
  userSignUpPost,
};
