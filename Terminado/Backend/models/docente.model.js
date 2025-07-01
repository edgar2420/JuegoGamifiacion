module.exports = (sequelize, DataTypes) => {
  const Docente = sequelize.define("docentes", {
    nombre: { type: DataTypes.STRING, allowNull: false },
    correo: { type: DataTypes.STRING, allowNull: false, unique: true },
    asignatura: { type: DataTypes.STRING },
    rol: { type: DataTypes.ENUM("admin", "docente"), defaultValue: "docente" },
  });

  return Docente;
};
