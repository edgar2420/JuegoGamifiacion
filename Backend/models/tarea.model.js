module.exports = (sequelize, DataTypes) => {
  const Tarea = sequelize.define("tareas", {
    titulo: { type: DataTypes.STRING, allowNull: false },
    fecha_entrega: { type: DataTypes.DATE, allowNull: false },
    estado: { type: DataTypes.ENUM("correcta", "tarde", "con_errores"), allowNull: false }
  });

  return Tarea;
};
