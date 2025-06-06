module.exports = (sequelize, DataTypes) => {
  const Ranking = sequelize.define("rankings", {
    totalCC: { type: DataTypes.FLOAT, defaultValue: 0 },
    posicion: { type: DataTypes.INTEGER }
  });

  return Ranking;
};
