module.exports = (sequelize, DataTypes) => {
  const EstudianteLogro = sequelize.define("estudiante_logros", {
    fecha_obtenido: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });

  return EstudianteLogro;
};
