const express = require("express");

module.exports = (app, io) => {
  const router = express.Router();
  const controller = require("../controllers/tarea.controller")(io);

  // Registrar una entrega (cuando el docente hace entrega manual)
  router.post("/registrar", controller.registrarTarea);

  // Consultar historial de tareas por estudiante
  router.get("/por-estudiante/:id", controller.obtenerTareasPorEstudiante);

  // Consultar todas las tareas (uso docente/admin)
  router.get("/todas", controller.obtenerTodasLasTareas);

  // Crear tarea masiva para todos los estudiantes
  router.post("/crear-docente", controller.crearTareaParaTodos);

  // Estudiante sube su archivo de entrega
  router.post("/entregar/:id", controller.entregarTarea);

  // Docente califica la tarea (correcta, tarde, con errores)
  router.put("/calificar/:id", controller.calificarTarea);

  // Montar el router
  app.use("/tareas", router);
};
