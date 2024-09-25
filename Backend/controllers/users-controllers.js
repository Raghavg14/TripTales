const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const HttpError = require("../models/http-error");

const JWT_PASS = process.env.JWT_KEY;

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
  } catch (error) {
    return next(new HttpError("Fetching users failed, Please try again", 500));
  }
};

const userSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, Please check your data", 422)
    );
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new HttpError("User already exist, please login instead", 422)
      );
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
      console.log(error);

      return next(
        new HttpError("Could not create user, please try again", 500)
      );
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file.path,
      places: [],
    });

    await newUser.save();

    let token;
    try {
      token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_PASS, {
        expiresIn: "1h",
      });
    } catch (error) {
      return next(new HttpError("Signup failed, Please try again", 500));
    }

    res.status(201).json({
      userId: newUser.id,
      email: newUser.email,
      token,
    });
  } catch (error) {
    return next(new HttpError("Signup failed, Please try again", 500));
  }
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(
        new HttpError(
          "Invalid Credentials, could not log you in. Please try again.",
          403
        )
      );
    }

    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (error) {
      return next(
        new HttpError(
          "Invalid Credentials, could not log you in.Please try again.",
          500
        )
      );
    }

    if (!isValidPassword) {
      return next(
        new HttpError("Invalid Credentials, could not log you in.", 403)
      );
    }

    let token;
    try {
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        JWT_PASS,
        {
          expiresIn: "1h",
        }
      );
    } catch (error) {
      return next(new HttpError("Logging in failed, Please try again", 500));
    }

    res.json({
      userId: existingUser.id,
      email: existingUser.email,
      token,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Logging in failed, Please try again", 500));
  }
};

module.exports = { getAllUsers, userSignup, userLogin };
