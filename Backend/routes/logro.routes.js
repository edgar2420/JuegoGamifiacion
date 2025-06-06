const express = require("express");
const router = express.Router();
const controller = require("../controllers/logro.controller");

router.post("/crear", controller.crearLogro);
router.get("/obtener", controller.obtenerLogros);
router.post("/asociar-estudiante", controller.asociarLogroAEstudiante);
router.get("/por-estudiante/:id", controller.obtenerLogrosPorEstudiante);
router.delete("/eliminar/:id", controller.eliminarLogro);

module.exports = app => {
  app.use("/logros", router);
};
