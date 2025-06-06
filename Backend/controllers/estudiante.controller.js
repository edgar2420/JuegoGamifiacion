const db = require("../models");
const Estudiante = db.estudiantes;
const Logro = db.logros;

// Crear estudiante
exports.crearEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.create(req.body);
    res.status(201).json(estudiante);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear estudiante", error });
  }
};

// Obtener todos los estudiantes
exports.obtenerEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll();
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener estudiantes", error });
  }
};

// Obtener perfil con logros y monedas
exports.obtenerPerfilEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByPk(req.params.id, {
      include: ["monedas", "logros"]
    });
    if (!estudiante) return res.status(404).json({ mensaje: "Estudiante no encontrado" });
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar perfil", error });
  }
};
