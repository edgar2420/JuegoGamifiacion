module.exports = (sequelize, DataTypes) => {
  const Logro = sequelize.define("logros", {
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING },
    tipo: { type: DataTypes.ENUM("racha", "reto", "participacion") },
    requisitos: { type: DataTypes.STRING }
  });

  return Logro;
};
