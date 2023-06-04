const { initialGetVideogames } = require("./../videogames/getVideogames/initialVideogames");

async function getPlatforms(req, res, next) {

    //Reutiliza la consulta de videogames y se itera sobre el resultado para armar el array de platforms.
    const results = await initialGetVideogames();
    
    const platforms = [];

  try {
    results.forEach(game =>
      game.platforms.forEach( platform => {
        if(!platforms.includes(platform)){
          platforms.push(platform);
        }
      }));
    return platforms;
  } catch (e) {
    next(e);
  }
}

module.exports = { getPlatforms };
