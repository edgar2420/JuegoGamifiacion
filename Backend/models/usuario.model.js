module.exports = (sequelize, Sequelize) => {
  const Usuario = sequelize.define("usuario", {
    nombre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    correo: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    contrasena: {
      type: Sequelize.STRING,
      allowNull: false
    },
    rol: {
      type: Sequelize.ENUM("admin", "docente", "estudiante"),
      allowNull: false
    }
  });

  return Usuario;
};
