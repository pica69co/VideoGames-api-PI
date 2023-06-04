const { Genre } = require("../../db");
const { getPlatforms } = require("../../controllers/platforms/platforms.js");


async function getInfo(req, res, next) {
  try {
    const platforms= await getPlatforms();

    const genre = await Genre.findAll();

    return res.json({ platforms, genre });

  } catch (err) {
    (err) => next(err);
  }
}

module.exports = { getInfo };
