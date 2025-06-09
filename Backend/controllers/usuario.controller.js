const db = require("../models");
const Usuario = db.usuarios;
const bcrypt = require("bcryptjs");

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["contrasena"] },
      order: [["nombre", "ASC"]]
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: "Error al obtener usuarios", error });
  }
};

// Crear nuevo usuario
exports.crearUsuario = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { nombre, correo, contrasena, rol } = req.body;

    if (!nombre || !correo || !contrasena || !rol) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      contrasena: hashedPassword,
      rol
    }, { transaction });

    // Si es estudiante → crear perfilEstudiante
    if (rol === "estudiante") {
      await db.estudiantes.create({
        usuarioId: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        totalCC: 0,
        racha: 0
      }, { transaction });
    }

    // Si es docente → crear perfilDocente
    if (rol === "docente") {
      await db.docentes.create({
        usuarioId: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        asignatura: null,  // si luego quieres puedes poner asignatura
        rol: "docente"
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    await transaction.rollback();
    res.status(500).json({ mensaje: "Error al crear usuario", error });
  }
};


// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // También eliminar perfil asociado si existe
    if (usuario.rol === "estudiante") {
      await db.estudiantes.destroy({ where: { usuarioId: usuario.id }, transaction });
    }
    if (usuario.rol === "docente") {
      await db.docentes.destroy({ where: { usuarioId: usuario.id }, transaction });
    }

    await usuario.destroy({ transaction });

    await transaction.commit();

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario", error });
  }
};
