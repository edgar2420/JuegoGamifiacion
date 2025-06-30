const db = require("../models");
const Logro = db.logros;
const Estudiante = db.estudiantes;
const EstudianteLogro = db.estudiante_logros;

// Crear un nuevo logro
exports.crearLogro = async (req, res) => {
  try {
    const logro = await Logro.create(req.body);
    res.status(201).json(logro);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear logro", error });
  }
};

// Obtener todos los logros disponibles
exports.obtenerLogros = async (req, res) => {
  try {
    const logros = await Logro.findAll();
    res.json(logros);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener logros", error });
  }
};

// Asociar logro a un estudiante
exports.asociarLogroAEstudiante = async (req, res) => {
  try {
    const { estudianteId, logroId } = req.body;

    const estudiante = await Estudiante.findByPk(estudianteId);
    const logro = await Logro.findByPk(logroId);

    if (!estudiante || !logro) {
      return res.status(404).json({ mensaje: "Estudiante o Logro no encontrado" });
    }

    await estudiante.addLogro(logro); // relación many-to-many
    res.json({ mensaje: "Logro asociado al estudiante correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al asociar logro", error });
  }
};

// Obtener logros de un estudiante
exports.obtenerLogrosPorEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByPk(req.params.id, {
      include: ["logros"]
    });

    if (!estudiante) {
      return res.status(404).json({ mensaje: "Estudiante no encontrado" });
    }

    res.json(estudiante.logros);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar logros del estudiante", error });
  }
};

// Eliminar logro
exports.eliminarLogro = async (req, res) => {
  try {
    const logro = await db.logros.findByPk(req.params.id);

    if (!logro) {
      return res.status(404).json({ mensaje: "Logro no encontrado" });
    }

    await logro.destroy();

    res.json({ mensaje: "Logro eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar logro:", error);
    res.status(500).json({ mensaje: "Error al eliminar logro", error });
  }
};
