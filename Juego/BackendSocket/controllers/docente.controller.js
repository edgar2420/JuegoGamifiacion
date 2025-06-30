const db = require("../models");
const Docente = db.docentes;
const Tarea = db.tareas;
const Temporada = db.temporadas;
const Ranking = db.rankings;
const Estudiante = db.estudiantes;

// Crear docente
exports.crearDocente = async (req, res) => {
  try {
    const docente = await Docente.create(req.body);
    res.status(201).json(docente);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear docente", error });
  }
};

// Obtener todos los docentes
exports.obtenerDocentes = async (req, res) => {
  try {
    const docentes = await Docente.findAll();
    res.json(docentes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener docentes", error });
  }
};

// Obtener perfil de docente por usuarioId
exports.obtenerPerfilDocente = async (req, res) => {
  try {
    const docente = await Docente.findOne({
      where: { usuarioId: req.params.usuarioId },
    });

    if (!docente) {
      return res.status(404).json({ mensaje: "Docente no encontrado" });
    }

    res.json(docente);
  } catch (error) {
    console.error("Error al obtener perfil del docente:", error);
    res.status(500).json({ mensaje: "Error al obtener perfil del docente", error });
  }
};

// Consultar desempeño de estudiantes por docente
exports.obtenerDesempeno = async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      where: { docenteId: req.params.id },
      include: [{ model: Estudiante, as: "estudiante" }],
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar desempeño", error });
  }
};

// Crear temporada académica
exports.crearTemporada = async (req, res) => {
  try {
    const temporada = await Temporada.create(req.body);
    res.status(201).json(temporada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear temporada", error });
  }
};

// Cerrar temporada (cambiar estado)
exports.cerrarTemporada = async (req, res) => {
  try {
    const temporada = await Temporada.findByPk(req.params.id);
    if (!temporada) {
      return res.status(404).json({ mensaje: "Temporada no encontrada" });
    }

    temporada.estado = "inactiva";
    await temporada.save();
    res.json({ mensaje: "Temporada cerrada", temporada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cerrar temporada", error });
  }
};

// obtener perfil docente
exports.obtenerPerfilDocente = async (req, res) => {
  try {
    const docente = await Docente.findOne({
      where: { usuarioId: req.params.usuarioId },
    });

    if (!docente) {
      return res.status(404).json({ mensaje: "Docente no encontrado" });
    }

    res.json(docente);
  } catch (error) {
    console.error("Error al obtener perfil del docente:", error);
    res.status(500).json({ mensaje: "Error al obtener perfil del docente", error });
  }
};

exports.obtenerTareasDocente = async (req, res) => {
  try {
    const docenteId = req.params.id;

    const tareas = await Tarea.findAll({
      where: { docenteId },
      include: [
        {
          model: Estudiante,
          as: "estudiante",
          attributes: ["nombre"]
        }
      ],
      attributes: [
        "id",
        "titulo",
        "fecha_inicio",
        "fecha_entrega",
        "estado",
        "archivoEntrega"
      ],
      order: [["fecha_entrega", "DESC"]]
    });

    res.json(tareas);
  } catch (error) {
    console.error("Error al obtener tareas del docente:", error);
    res.status(500).json({ mensaje: "Error al obtener tareas del docente", error });
  }
};
