module.exports = (sequelize, DataTypes) => {
  const Estudiante = sequelize.define("estudiantes", {
    nombre: { type: DataTypes.STRING, allowNull: false },
    correo: { type: DataTypes.STRING, allowNull: false, unique: true },
    totalCC: { type: DataTypes.FLOAT, defaultValue: 0 },
    racha: { type: DataTypes.INTEGER, defaultValue: 0 },
  });

  return Estudiante;
};
