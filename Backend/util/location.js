const axios = require("axios");

const HttpError = require("../models/http-error");

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
async function getCoordsFromAddress(title, address) {
  const query = `${title}, ${address}`;

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    query
  )}&key=${OPENCAGE_API_KEY}`;

  const response = await axios.get(url);

  if (response.data.status.code === 200 && response.data.results.length > 0) {
    const place = response.data.results[0];
    const coordinates = place.geometry;
    return coordinates;
  } else {
    throw new HttpError(
      "Could not find location for the specified address.",
      422
    );
  }
}

module.exports = getCoordsFromAddress;
