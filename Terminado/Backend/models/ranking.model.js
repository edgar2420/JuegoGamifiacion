module.exports = (sequelize, DataTypes) => {
  const Ranking = sequelize.define("rankings", {
    totalCC: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    posicion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ["estudianteId", "temporadaId"]
      }
    ]
  });

  return Ranking;
};
