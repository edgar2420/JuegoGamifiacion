const db = require("../models");
const Docente = db.docentes;
const Tarea = db.tareas;
const Temporada = db.temporadas;
const Ranking = db.rankings;

// Crear docente
exports.crearDocente = async (req, res) => {
  try {
    const docente = await Docente.create(req.body);
    res.status(201).json(docente);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear docente", error });
  }
};

// Obtener docentes
exports.obtenerDocentes = async (req, res) => {
  try {
    const docentes = await Docente.findAll();
    res.json(docentes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener docentes", error });
  }
};

// Consultar desempeño de estudiantes por docente
exports.obtenerDesempeno = async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      where: { docenteId: req.params.id },
      include: ["estudiante"]
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
    if (!temporada) return res.status(404).json({ mensaje: "Temporada no encontrada" });

    temporada.estado = "inactiva";
    await temporada.save();
    res.json({ mensaje: "Temporada cerrada", temporada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cerrar temporada", error });
  }
};

// Crear tarea como Docente (asignar a estudiante)
exports.crearTareaDocente = async (req, res) => {
  try {
    const { titulo, fecha_entrega, estudianteId, docenteId } = req.body;

    const nuevaTarea = await db.tareas.create({
      titulo,
      fecha_entrega,
      estado: "pendiente",
      estudianteId,
      docenteId,
    });

    res.status(201).json({ mensaje: "Tarea asignada correctamente", tarea: nuevaTarea });
  } catch (error) {
    console.error("Error al asignar tarea:", error);
    res.status(500).json({ mensaje: "Error al asignar tarea", error });
  }
};
