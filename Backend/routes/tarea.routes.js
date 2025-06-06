const express = require("express");
const router = express.Router();
const controller = require("../controllers/tarea.controller");

router.post("/registrar", controller.registrarTarea);
router.get("/por-estudiante/:id", controller.obtenerTareasPorEstudiante);
router.get("/todas", controller.obtenerTodasLasTareas);

module.exports = app => {
  app.use("/tareas", router);
};
