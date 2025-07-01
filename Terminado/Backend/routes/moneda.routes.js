const express = require("express");
const router = express.Router();
const controller = require("../controllers/moneda.controller");

router.get("/por-estudiante/:id", controller.obtenerMonedasPorEstudiante);
router.post("/crear", controller.crearMonedaManual);

module.exports = app => {
  app.use("/monedas", router);
};
