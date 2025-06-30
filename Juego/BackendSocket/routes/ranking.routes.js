const express = require("express");
const router = express.Router();
const controller = require("../controllers/ranking.controller");

// Actualizar ranking y emitir evento por socket
router.post("/actualizar", controller.actualizarRanking);

// Obtener ranking actual (última temporada activa)
router.get("/actual", controller.obtenerRankingActual);

// Obtener ranking por ID de temporada
router.get("/por-temporada/:temporadaId", controller.obtenerRankingPorTemporada);

// Obtener ranking acumulado (global)
router.get("/estudiantes", controller.obtenerRanking);

module.exports = app => {
  app.use("/ranking", router);
};
