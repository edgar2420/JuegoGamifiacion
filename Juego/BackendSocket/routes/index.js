module.exports = (app, io) => {
  console.log("Cargando rutas...");

  require("./auth.routes")(app);
  require("./usuario.routes")(app);
  require("./docente.routes")(app);
  require("./estudiante.routes")(app);
  require("./logro.routes")(app);
  require("./ranking.routes")(app);
  require("./tarea.routes")(app, io);
  require("./temporada.routes")(app);
  require("./moneda.routes")(app);

  console.log("Todas las rutas cargadas");
};
