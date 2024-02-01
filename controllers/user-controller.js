const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const UserModel = require("../models/user-model");
const MessageModel = require("../models/message-model");

const userSignUpGet = (req, res) => {
  res.render("signup-form-view", {
    title: "Sign up",
  });
};

const userSignUpPost = [
  body("first-name", "First name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage("First Name should only contain letters")
    .escape(),
  body("last-name", "Last Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage("Last Name should only contain letters")
    .escape(),
  body("user-name", "User Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .isAlphanumeric()
    .withMessage("User Name should only contain letters and numbers")
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
    .isAlphanumeric()
    .withMessage("Password should only contain letters and numbers")
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

const userLoginGet = (req, res) => {
  res.render("login-form-view", {
    title: "Log in",
  });
};

const userLoginPost = [
  body("user-name").trim().escape(),
  body("password").trim().escape(),

  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        next(err);
      } else if (!user) {
        res.render("login-form-view", {
          title: "Log in",
          loginError: info,
          userName: req.body["user-name"],
        });
      } else {
        req.login(user, next);
      }
    })(req, res, next);
  },

  (req, res) => {
    res.redirect("/");
  },
];

const userLogOutGet = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/");
    }
  });
};

const deleteUserPost = asyncHandler(async (req, res, next) => {
  const allMessagesByUser = await MessageModel.countDocuments({
    user: req.body["user-id"],
  }).exec();

  // Check user has messages and user is not admin to prevent accidentally delete admin
  if (allMessagesByUser > 0 && req.user.id !== req.body["user-id"]) {
    await MessageModel.deleteMany({ user: req.body["user-id"] });
    await UserModel.findByIdAndDelete(req.body["user-id"]);
  }

  res.redirect("/");
});

const userToMemberGet = (req, res) => {
  res.render("become-member-form-view", {
    title: "Become a member",
  });
};

const userToMemberPost = [
  body("member-secret", "Member Secret should not be empty")
    .trim()
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage("Member Secret should only contain letters")
    .escape()
    .custom((value) => value === process.env.MEMBER_SECRET)
    .withMessage("Incorrect Member Secret"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("become-member-form-view", {
        title: "Become a member",
        memberSecret: req.body["member-secret"],
        errors: errors.array(),
      });
    } else {
      const user = new UserModel({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        password: req.user.password,
        role: "member",
        _id: req.user.id,
      });

      await UserModel.findByIdAndUpdate(req.user.id, user, {});
      res.redirect("/");
    }
  }),
];

module.exports = {
  userSignUpGet,
  userSignUpPost,
  userLoginGet,
  userLoginPost,
  userLogOutGet,
  deleteUserPost,
  userToMemberGet,
  userToMemberPost,
};
