const express = require("express");
const router = express.Router();
const controller = require("../controllers/ranking.controller");

router.post("/actualizar", controller.actualizarRanking);
router.get("/actual", controller.obtenerRankingActual);
router.get("/por-temporada/:temporadaId", controller.obtenerRankingPorTemporada);
router.get("/estudiantes", controller.obtenerRanking);

module.exports = app => {
  app.use("/ranking", router);
};
