const axios = require("axios").default;
const { Op } = require("sequelize");
const { Videogame, Genre } = require("../../../db");
const { BASE_URL, BASE_VIDEOGAMES } = require("../../../../constants");
const { RAWG_API_KEY } = process.env;

const searchVideogames = async (search) => {
  const results = [];

  // busca y trae los videogames de base de datos.
  const videogamesDB = await Videogame.findAll(
    { where: { name: { [Op.iLike]: `%${search}%` } } },
    { include: [Genre] }
  );

  let dataDB =
    videogamesDB &&
    videogamesDB.map((game) => ({
      name: game.dataValues.name,
      genres: game.dataValues.genres,
      image: `https://i.ebayimg.com/images/g/rcUAAOSwll1WulW3/s-l500.jpg`,
      rating: game.dataValues.rating,
      platforms: game.dataValues.platforms,
      id: game.dataValues.id,
      source: "local",
    }));

  dataDB.forEach((game) => results.push(game));

  //* busca los videogames de la api.

  let apiRawg = `${BASE_URL}${BASE_VIDEOGAMES}?key=${RAWG_API_KEY}&search=${search}`;

  for (let i = 1; i <= 7 && apiRawg; i++) {
    const videogamesAPI = await axios.get(apiRawg, {
      responseType: "json",
    });

    // atributo next para traer mas videogames desde la API
    apiRawg = videogamesAPI.data.next;

    let dataAPI =
      videogamesAPI.data.results &&
      videogamesAPI.data.results.map((game) => ({
        name: game.name,
        image: game.background_image,
        genres: game.genres && game.genres.map((genre) => genre.name),
        rating: game.rating,
        platforms:
          game.platforms &&
          game.platforms.map((platform) => platform.platform.name),
        id: game.id,
        source: "api",
      }));

    const filteredDataAPI = dataAPI.filter((game) =>
      game.name.toLowerCase().includes(search.toLowerCase())
    );

    filteredDataAPI.forEach((game) => results.push(game));
  }

  if (results.length === 0) {
    results.push({
      name: "Videogames no encontrados",
      image: "",
      genres: "",
      rating: "",
      platforms: "",
      id: "",
      source: "",
    });
  }

  return results;
};

module.exports = { searchVideogames };
