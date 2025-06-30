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
    const estudianteId = req.params.id;

    // Buscar estudiante por ID
    const estudiante = await Estudiante.findByPk(estudianteId, {
      include: [
        {
          model: Logro,
          as: "logros",
          attributes: ["id", "nombre", "email"]
        }
      ]
    });

    if (!estudiante) {
      return res.status(404).json({ mensaje: "Estudiante no encontrado" });
    }

    // Obtener monedas del estudiante
    const monedas = await db.moneda_cc.findAll({
      where: { estudianteId },
      attributes: ["cantidad"]
    });

    res.json({
      estudiante,
      logros: estudiante.logros,
      monedas
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener perfil del estudiante", error });
  }
};
