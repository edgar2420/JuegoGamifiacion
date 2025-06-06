const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuario.controller");

router.get("/obtener", controller.obtenerUsuarios);
router.post("/crear", controller.crearUsuario);
router.delete("/eliminar/:id", controller.eliminarUsuario);

module.exports = app => {
  app.use("/usuarios", router);
};
