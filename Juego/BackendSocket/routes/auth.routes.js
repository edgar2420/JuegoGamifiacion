const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Ruta de prueba (para verificar que /auth sí responde)
router.get("/test", (req, res) => {
  res.json({ msg: "Auth test OK" });
});

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", authController.logout);

// Obtener usuario autenticado
router.get("/me", authController.me);

// Exportar el router para que se use en index.js
module.exports = app => {
  console.log("auth.routes.js cargado");
  app.use("/auth", router);
};
