const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

const {
  getAllUsers,
  userSignup,
  userLogin,
} = require("../controllers/users-controllers");

const router = express.Router();

//Get a list of all Users
router.get("/", getAllUsers);

//Signup a Users
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userSignup
);

//Login a Users
router.post("/login", userLogin);

module.exports = router;
