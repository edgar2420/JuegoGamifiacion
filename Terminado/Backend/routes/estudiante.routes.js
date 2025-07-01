const express = require("express");
const router = express.Router();
const controller = require("../controllers/estudiante.controller");

router.post("/crear", controller.crearEstudiante);
router.get("/obtener", controller.obtenerEstudiantes);
router.get("/perfil/:id", controller.obtenerPerfilEstudiante);

module.exports = app => {
  app.use("/estudiantes", router);
};
