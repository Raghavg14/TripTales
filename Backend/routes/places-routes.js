const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-Auth");

const {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlacebyId,
  deletePlacebyId,
} = require("../controllers/places-controllers");

const router = express.Router();

// Get all places by user ID
router.get("/user/:uid", getPlacesByUserId);

// Get place by place ID
router.get("/:pid", getPlaceById);

//to check if the user is logged in or not and only logged in users are allowed
router.use(checkAuth);

//create new place
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").notEmpty(),
  ],
  createPlace
);

// update place by place ID
router.patch(
  "/:pid",
  [check("title").notEmpty(), check("description").isLength({ min: 5 })],
  updatePlacebyId
);

// delete place by place ID
router.delete("/:pid", deletePlacebyId);

module.exports = router;
