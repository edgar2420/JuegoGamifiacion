const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.auth_tokens = require("./auth_token.model.js")(sequelize, Sequelize);

db.estudiantes = require("./estudiante.model.js")(sequelize, Sequelize);
db.docentes = require("./docente.model.js")(sequelize, Sequelize);
db.tareas = require("./tarea.model.js")(sequelize, Sequelize);
db.moneda_cc = require("./moneda_cc.model.js")(sequelize, Sequelize);
db.rankings = require("./ranking.model.js")(sequelize, Sequelize);
db.temporadas = require("./temporada.model.js")(sequelize, Sequelize);
db.logros = require("./logro.model.js")(sequelize, Sequelize);
db.estudiante_logros = require("./estudiante_logro.model.js")(sequelize, Sequelize);

// Relaciones

// Usuarios
db.usuarios.hasMany(db.auth_tokens, { foreignKey: "usuarioId", as: "tokens" });
db.auth_tokens.belongsTo(db.usuarios, { foreignKey: "usuarioId", as: "usuario" });

db.usuarios.hasOne(db.estudiantes, { foreignKey: "usuarioId", as: "perfilEstudiante" });
db.estudiantes.belongsTo(db.usuarios, { foreignKey: "usuarioId", as: "usuario" });

db.usuarios.hasOne(db.docentes, { foreignKey: "usuarioId", as: "perfilDocente" });
db.docentes.belongsTo(db.usuarios, { foreignKey: "usuarioId", as: "usuario" });

// Tareas
db.estudiantes.hasMany(db.tareas, { foreignKey: "estudianteId", as: "tareas" });
db.tareas.belongsTo(db.estudiantes, { foreignKey: "estudianteId", as: "estudiante" });

db.docentes.hasMany(db.tareas, { foreignKey: "docenteId", as: "tareas" });
db.tareas.belongsTo(db.docentes, { foreignKey: "docenteId", as: "docente" });

// MonedaCC
db.estudiantes.hasMany(db.moneda_cc, { foreignKey: "estudianteId", as: "monedas" });
db.moneda_cc.belongsTo(db.estudiantes, { foreignKey: "estudianteId", as: "estudiante" });

db.tareas.hasMany(db.moneda_cc, { foreignKey: "tareaId", as: "monedas" });
db.moneda_cc.belongsTo(db.tareas, { foreignKey: "tareaId", as: "tarea" });

db.temporadas.hasMany(db.moneda_cc, { foreignKey: "temporadaId", as: "monedas" });
db.moneda_cc.belongsTo(db.temporadas, { foreignKey: "temporadaId", as: "temporada" });

// Ranking
db.estudiantes.hasMany(db.rankings, { foreignKey: "estudianteId", as: "rankings" });
db.rankings.belongsTo(db.estudiantes, { foreignKey: "estudianteId", as: "estudiante" });

db.temporadas.hasMany(db.rankings, { foreignKey: "temporadaId", as: "rankings" });
db.rankings.belongsTo(db.temporadas, { foreignKey: "temporadaId", as: "temporada" });

// Logros (muchos a muchos)
db.estudiantes.belongsToMany(db.logros, {
  through: db.estudiante_logros,
  as: "logros",
  foreignKey: "estudianteId"
});
db.logros.belongsToMany(db.estudiantes, {
  through: db.estudiante_logros,
  as: "estudiantes",
  foreignKey: "logroId"
});

db.estudiante_logros.belongsTo(db.estudiantes, { foreignKey: "estudianteId", as: "estudiante" });
db.estudiante_logros.belongsTo(db.logros, { foreignKey: "logroId", as: "logro" });

module.exports = db;
