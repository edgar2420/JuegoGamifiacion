const db = require("../models");
const Tarea = db.tareas;
const Estudiante = db.estudiantes;

exports.obtenerDesempeno = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll();

    const desempenoData = await Promise.all(
      estudiantes.map(async (est) => {
        const totalTareas = await Tarea.count({ where: { estudianteId: est.id } });
        const tareasCorrectas = await Tarea.count({
          where: {
            estudianteId: est.id,
            estado: "correcta",
          },
        });

        return {
          estudianteId: est.id,
          estudiante: { nombre: est.nombre },
          totalTareas,
          tareasCorrectas,
          totalCC: est.totalCC,
        };
      })
    );

    res.json(desempenoData);
  } catch (error) {
    console.error("Error al obtener desempeño:", error);
    res.status(500).json({ mensaje: "Error al obtener desempeño", error });
  }
};
