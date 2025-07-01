const express = require("express");
const router = express.Router();
const controller = require("../controllers/temporada.controller");

router.post("/crear", controller.crearTemporada);
router.post("/cerrar/:id", controller.cerrarTemporada);
router.get("/historial", controller.obtenerHistorialTemporadas);
router.get("/activa", controller.obtenerTemporadaActiva);
router.put("/editar/:id", controller.editarTemporada);
router.post("/activar/:id", controller.activarTemporada);
router.post("/desactivar/:id", controller.desactivarTemporada);



module.exports = app => {
  app.use("/temporadas", router);
};
