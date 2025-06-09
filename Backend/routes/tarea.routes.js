const express = require("express");
const router = express.Router();
const controller = require("../controllers/tarea.controller");

// Registrar una entrega (cuando el docente hace entrega manual, no desde panel de asignación masiva)
router.post("/registrar", controller.registrarTarea);

// Consultar historial de tareas por estudiante
router.get("/por-estudiante/:id", controller.obtenerTareasPorEstudiante);

// Consultar todas las tareas (uso docente/admin)
router.get("/todas", controller.obtenerTodasLasTareas);

// Crear tarea masiva para todos los estudiantes (desde AsignarTareasPage)
router.post("/crear-docente", controller.crearTareaParaTodos);

// Estudiante sube su archivo de entrega
router.post("/entregar/:id", controller.entregarTarea);

// Docente califica la tarea (correcta, tarde, con errores)
router.put("/calificar/:id", controller.calificarTarea);

module.exports = app => {
  app.use("/tareas", router);
};
