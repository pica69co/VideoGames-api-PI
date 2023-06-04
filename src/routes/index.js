const { Router } = require("express");
const {
  getVideogameDetail,
} = require("../controllers/videogames/getVideogameDetail.js");
const { addVideogame } = require("../controllers/videogames/addVideogames.js");
const { getVideogames } = require("../controllers/videogames/getVideogames.js");
const { getInfo } = require("../controllers/preload/getInitialInfo.js");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("", getInfo);
router.get("/videogames", getVideogames);
router.get("/videogames/:id", getVideogameDetail);
router.post("/videogame", addVideogame);

module.exports = router;
