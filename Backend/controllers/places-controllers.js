const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const fs = require("fs");

const HttpError = require("../models/http-error");
const getCoordsFromAddress = require("../util/location");
const Place = require("../models/places");
const User = require("../models/user");

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    const places = await Place.find({ creator: userId });

    if (places.length === 0) {
      return next(new HttpError("User have not uploaded any places", 404));
    }
    res.json({
      places: places.map((place) => place.toObject({ getters: true })),
    });
  } catch (error) {
    return next(
      new HttpError("Fetching places failed, please try again.", 500)
    );
  }
};

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  try {
    const place = await Place.findById(placeId);

    if (!place) {
      return next(
        new HttpError("Could not find place for the provided placeId", 404)
      );
    }

    res.json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(new HttpError("Fetching place failed, please try again.", 500));
  }
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, Please check your data", 422)
    );
  }

  const { title, description, address } = req.body;
  let sess;
  try {
    const user = await User.findById(req.userData.userId);
    if (!user) {
      return next(new HttpError("Could not find user for provided id.", 404));
    }

    const location = await getCoordsFromAddress(title, address).catch(
      (error) => {
        return next(error);
      }
    );

    const createdPlace = new Place({
      title,
      description,
      address,
      image: req.file.path,
      location,
      creator: req.userData.userId,
    });

    sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace._id); //will only push the id of the new place
    await user.save({ session: sess });
    await sess.commitTransaction();
    res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
  } catch (error) {
    if (sess) {
      await sess.abortTransaction();
    }
    return next(new HttpError("Creating place failed, please try again", 500));
  } finally {
    if (sess) {
      sess.endSession();
    }
  }
};

const updatePlacebyId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, Please check your data", 422)
    );
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
    if (!place) {
      return next(
        new HttpError("Could not find place for the provided placeId.", 404)
      );
    }

    if (place.creator.toString() !== req.userData.userId) {
      return next(
        new HttpError("You are not allowed to edit this place.", 401)
      );
    }

    place.title = title;
    place.description = description;

    await place.save();
    res.json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(new HttpError("Updating place failed, please try again.", 500));
  }
};

const deletePlacebyId = async (req, res, next) => {
  const placeId = req.params.pid;

  if (!mongoose.Types.ObjectId.isValid(placeId)) {
    return next(new HttpError("Invalid placeId", 400));
  }

  let sess;
  try {
    const place = await Place.findById(placeId).populate("creator");

    if (!place) {
      return next(
        new HttpError("Could not find place for the provided placeId", 404)
      );
    }

    if (place.creator.id !== req.userData.userId) {
      return next(
        new HttpError("You are not allowed to edit this place.", 401)
      );
    }

    sess = await mongoose.startSession();
    sess.startTransaction();

    await Place.deleteOne({ _id: placeId }, { session: sess });
    place.creator.places.pull(placeId);
    await place.creator.save({ session: sess });

    await sess.commitTransaction();
    fs.unlink(place.image, (error) => {
      console.log(error);
    });
    res.json({ message: "Place deleted successfully." });
  } catch (error) {
    if (sess) {
      await sess.abortTransaction();
    }
    console.log(error);
    return next(new HttpError("Deleting place failed, please try again.", 500));
  } finally {
    if (sess) {
      sess.endSession();
    }
  }
};

module.exports = {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlacebyId,
  deletePlacebyId,
};
