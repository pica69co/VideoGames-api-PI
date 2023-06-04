const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const axios = require("axios").default;
//const { Op } = require("sequelize");
const { Videogame, Genre } = require("../../db");
const { BASE_URL, BASE_VIDEOGAMES } = require("../../../constants");
const { RAWG_API_KEY } = process.env;

async function getVideogameDetail(req, res, next) {
  try {
    const { id } = req.params;
    // let videogame = undefined;

    if (uuidValidate(id)) {
      let videogame = await Videogame.findByPk(id, {
        include: Genre,
      });

      let {
        id: videogame_id,
        name,
        description,
        released,
        rating,
        platforms: platformsToFix,
        background_image,
        genres: genresToFix,
      } = videogame.dataValues;
      
      let genres = genresToFix.map((genre) => ({
        id: genre.dataValues.id,
        name: genre.dataValues.name,
      }));

      let platforms = platformsToFix
        .split(",")
        .map((platform) => ({ platform: { name: platform } }));

      background_image = `https://i.ebayimg.com/images/g/rcUAAOSwll1WulW3/s-l500.jpg`;
      
      //https://i.ebayimg.com/images/g/rcUAAOSwll1WulW3/s-l500.jpg
    } else {
        
      const videogame = await axios.get(
        `${BASE_URL}${BASE_VIDEOGAMES}/${id.toString()}?key=${RAWG_API_KEY}`,
        {responseType: "json",});

      var {
        id: videogame_id,
        name,
        description_raw: description,
        released,
        rating,
        platforms,
        background_image,
        genres,
      } = videogame.data;
    }

    res.json({
      data: {
        id: videogame_id,
        name: name,
        description: description,
        released: released,
        rating: rating,
        platforms: platforms.map((p) => p.platform.name),
        image: background_image,
        genres: genres.map((genre) => genre.name),
      },
    });
    
  } catch (e) {
    next(e);
    //res.send(error);
  }
}

module.exports = { getVideogameDetail };
