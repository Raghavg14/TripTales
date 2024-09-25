const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const JWT_PASS = process.env.JWT_KEY;

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication Failed");
    }
    const decodeToken = jwt.verify(token, JWT_PASS);
    req.userData = { userId: decodeToken.userId };
    next();
  } catch (error) {
    return next(new HttpError("Authentication Failed", 403));
  }
};
