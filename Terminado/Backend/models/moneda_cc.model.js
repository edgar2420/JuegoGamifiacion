module.exports = (sequelize, DataTypes) => {
  const MonedaCC = sequelize.define("moneda_cc", {
    cantidad: { 
      type: DataTypes.FLOAT, 
      allowNull: false 
    },
    motivo: { 
      type: DataTypes.ENUM("tarea", "bono", "reto"), 
      allowNull: false 
    },
    fecha: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
    estudianteId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    tareaId: { 
      type: DataTypes.INTEGER, 
      allowNull: true 
    },
    temporadaId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  return MonedaCC;
};
