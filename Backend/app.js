require("dotenv").config();
const fs = require("fs");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(express.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PATCH, DELETE");
  next();
});

app.use("/api/users", userRoutes);

app.use("/api/places", placesRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this Route", 404);
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (error) => {
      console.log(error);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@officeprojectcluster.rtwgnbh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=officeProjectCluster`
  )
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is running and connected to database");
    });
  })
  .catch((error) => console.log(error));
