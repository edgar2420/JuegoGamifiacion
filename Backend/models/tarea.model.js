module.exports = (sequelize, DataTypes) => {
  const Tarea = sequelize.define("tareas", {
    titulo: { type: DataTypes.STRING, allowNull: false },
    fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false },
    fecha_entrega: { type: DataTypes.DATEONLY, allowNull: false },
    estado: {
      type: DataTypes.ENUM("pendiente", "entregada", "correcta", "tarde", "con_errores"),
      allowNull: false,
      defaultValue: "pendiente"
    },
    archivoEntrega: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Tarea;
};
