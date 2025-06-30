const express = require("express");
const router = express.Router();
const controller = require("../controllers/docente.controller");


// Crear nuevo docente
router.post("/crear", controller.crearDocente);

// Obtener todos los docentes
router.get("/obtener", controller.obtenerDocentes);

// Obtener perfil del docente por usuarioId
router.get("/obtenerPerfil/:usuarioId", controller.obtenerPerfilDocente);

// Obtener desempeño de estudiantes por docente
router.get("/desempeno/:id", controller.obtenerDesempeno);

// Obtener tareas asignadas por docente
router.get("/desempeno/:id", controller.obtenerTareasDocente);

// Crear temporada
router.post("/crear-temporada", controller.crearTemporada);

// Cerrar temporada
router.put("/cerrar-temporada/:id", controller.cerrarTemporada);

module.exports = app => {
  app.use("/docentes", router);
};
