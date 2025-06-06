module.exports = (sequelize, DataTypes) => {
  const Temporada = sequelize.define("temporadas", {
    nombre: { type: DataTypes.STRING, allowNull: false },
    fecha_inicio: { type: DataTypes.DATE, allowNull: false },
    fecha_fin: { type: DataTypes.DATE, allowNull: false },
    estado: { type: DataTypes.ENUM("activa", "inactiva"), defaultValue: "activa" }
  });

  return Temporada;
};
