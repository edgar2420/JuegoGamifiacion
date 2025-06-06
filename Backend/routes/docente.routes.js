const express = require("express");
const router = express.Router();
const controller = require("../controllers/docente.controller");

router.post("/crear", controller.crearDocente);
router.get("/obtener", controller.obtenerDocentes);
router.get("/desempeno/:id", controller.obtenerDesempeno);
router.post("/crear-tarea", controller.crearTareaDocente);

module.exports = app => {
  app.use("/docentes", router);
};
