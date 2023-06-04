//const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const axios = require("axios").default;
//const { Op } = require("sequelize");
const { Videogame, Genre } = require("../../../db");
const { BASE_URL, BASE_VIDEOGAMES } = require("../../../../constants");
const { RAWG_API_KEY } = process.env;

const initialGetVideogames = async () => {
  const videogamesPpal = [];

  //Primero busco, acomodo y traigo los videogames de mi base de datos.

  let videogamesDB = await Videogame.findAll({ include: [Genre] });
  videogamesDB.forEach((game) =>
    videogamesPpal.push({
      name: game.dataValues.name,
      genres: game.dataValues.genres.map((genre) => genre.name),
      image: `https://i.ebayimg.com/images/g/rcUAAOSwll1WulW3/s-l500.jpg`,
      rating: game.dataValues.rating,
      platforms: game.dataValues.platforms,
      id: game.dataValues.id,
      source: "local",
    })
  );

  //Segundo, traigo los videogames desde la api.
  let apiRawg = `${BASE_URL}${BASE_VIDEOGAMES}?key=${RAWG_API_KEY}`;

  //Me traigo solo 100 resultados por cuestión de performance.
  for (let i = 1; i <= 5; i++) {
    let resp = await axios.get(apiRawg, {
      responseType: "json",
    });
    apiRawg = resp.data.next;
    resp.data.results.forEach((game) => {
      videogamesPpal.push({
        name: game.name,
        image: game.background_image,
        genres: game.genres.map((genre) => genre.name),
        rating: game.rating,
        platforms: game.platforms.map((platform) => platform.platform.name),
        id: game.id,
        source: "api",
      });
    });
  }

  return videogamesPpal;
};

module.exports = { initialGetVideogames };
