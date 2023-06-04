const { Genre } = require("../../db");
const axios = require("axios").default;
const { BASE_URL, BASE_GENRES } = require("../../../constants");
const { RAWG_API_KEY } = process.env;

async function getGenres(req, res, next) {
  try {
    const consultaApiGenres = await axios.get(
      `${BASE_URL}${BASE_GENRES}?key=${RAWG_API_KEY}`,
      {
        responseType: "json",
      }
    );

    const genresApi = consultaApiGenres.data.results;

    genresApi.map(
      async (genre) =>
        await Genre.findOrCreate({
          where: { name: genre.name },
          defaults: {
            id: genre.id,
            name: genre.name,
          },
        })
    );
    res.json({ data: genresApi });
  } catch (err) {
    (err) => next(err);
  }
}

module.exports = { getGenres };
