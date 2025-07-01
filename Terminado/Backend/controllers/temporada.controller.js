const db = require("../models");
const Temporada = db.temporadas;
const Tarea = db.tareas;
const MonedaCC = db.moneda_cc;
const EstudianteLogro = db.estudiante_logros;
const Logro = db.logros;
const Estudiante = db.estudiantes;
const { Op } = db.Sequelize;

// Crear nueva temporada
exports.crearTemporada = async (req, res) => {
  try {
    const { nombre, fecha_inicio, fecha_fin } = req.body;

    // No desactiva otras temporadas, permite varias activas
    const nueva = await db.temporadas.create({
      nombre,
      fecha_inicio,
      fecha_fin,
      estado: "activa"
    });

    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear temporada", error });
  }
};

// Cerrar temporada
exports.cerrarTemporada = async (req, res) => {
  try {
    const temporada = await Temporada.findByPk(req.params.id);

    if (!temporada) {
      return res.status(404).json({ mensaje: "Temporada no encontrada" });
    }

    // 1️⃣ Cerrar la temporada
    temporada.estado = "inactiva";
    await temporada.save();

    // 2️⃣ Obtener tareas de la temporada
    const tareas = await Tarea.findAll({
      where: {
        fecha_entrega: {
          [Op.between]: [temporada.fecha_inicio, temporada.fecha_fin]
        }
      }
    });

    // Agrupar por estudiante
    const tareasPorEstudiante = {};
    const totalPorEstudiante = {};

    tareas.forEach(tarea => {
      const estId = tarea.estudianteId;
      if (!tareasPorEstudiante[estId]) {
        tareasPorEstudiante[estId] = 0;
        totalPorEstudiante[estId] = 0;
      }
      totalPorEstudiante[estId] += 1;
      if (tarea.estado === "correcta") {
        tareasPorEstudiante[estId] += 1;
      }
    });

    // 3️⃣ Calcular "más tareas perfectas del mes"
    let maxCorrectas = -1;
    let estudianteMaxCorrectas = null;

    for (const estId in tareasPorEstudiante) {
      if (tareasPorEstudiante[estId] > maxCorrectas) {
        maxCorrectas = tareasPorEstudiante[estId];
        estudianteMaxCorrectas = estId;
      }
    }

    // 4️⃣ Calcular "mejor promedio de entrega"
    let mejorPromedio = -1;
    let estudianteMejorPromedio = null;

    for (const estId in totalPorEstudiante) {
      const promedio = tareasPorEstudiante[estId] / totalPorEstudiante[estId];
      if (promedio > mejorPromedio) {
        mejorPromedio = promedio;
        estudianteMejorPromedio = estId;
      }
    }

    // 5️⃣ Premiar estudiantes con 5 CC + logro correspondiente
    const logroMasTareas = await Logro.findOne({ where: { tipo: "reto", nombre: "Más tareas perfectas del mes" } });
    const logroMejorPromedio = await Logro.findOne({ where: { tipo: "reto", nombre: "Mejor promedio de entrega" } });

    // Premiar estudiante con más tareas correctas
    if (estudianteMaxCorrectas && logroMasTareas) {
      await MonedaCC.create({
        cantidad: 5,
        motivo: "reto",
        fecha: new Date(),
        estudianteId: estudianteMaxCorrectas
      });

      const estudiante = await Estudiante.findByPk(estudianteMaxCorrectas);
      estudiante.totalCC += 5;
      await estudiante.save();

      await EstudianteLogro.create({
        estudianteId: estudianteMaxCorrectas,
        logroId: logroMasTareas.id,
        fecha_obtenido: new Date()
      });

      console.log(`🏆 Estudiante ${estudianteMaxCorrectas} ganó Más tareas perfectas del mes`);
    }

    // Premiar estudiante con mejor promedio
    if (estudianteMejorPromedio && logroMejorPromedio) {
      await MonedaCC.create({
        cantidad: 5,
        motivo: "reto",
        fecha: new Date(),
        estudianteId: estudianteMejorPromedio
      });

      const estudiante = await Estudiante.findByPk(estudianteMejorPromedio);
      estudiante.totalCC += 5;
      await estudiante.save();

      await EstudianteLogro.create({
        estudianteId: estudianteMejorPromedio,
        logroId: logroMejorPromedio.id,
        fecha_obtenido: new Date()
      });

      console.log(`🏆 Estudiante ${estudianteMejorPromedio} ganó Mejor promedio de entrega`);
    }

    res.json({ mensaje: "Temporada cerrada exitosamente, retos evaluados", temporada });
  } catch (error) {
    console.error("Error al cerrar temporada:", error);
    res.status(500).json({ mensaje: "Error al cerrar temporada", error });
  }
};

// Consultar historial de temporadas
exports.obtenerHistorialTemporadas = async (req, res) => {
  try {
    const temporadas = await Temporada.findAll({
      order: [["fecha_inicio", "DESC"]],
    });
    res.json(temporadas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar historial", error });
  }
};

// Obtener temporada activa
exports.obtenerTemporadaActiva = async (req, res) => {
  try {
    const temporadas = await Temporada.findAll({
      where: { estado: "activa" },
      order: [["createdAt", "DESC"]]
    });

    if (!temporadas.length) {
      return res.status(404).json({ mensaje: "No hay temporadas activas" });
    }

    res.json(temporadas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener temporadas activas", error });
  }
};



exports.editarTemporada = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, fecha_inicio, fecha_fin } = req.body;

    const temporada = await Temporada.findByPk(id);
    if (!temporada) {
      return res.status(404).json({ mensaje: "Temporada no encontrada" });
    }

    // Actualizar los campos
    temporada.nombre = nombre;
    temporada.fecha_inicio = fecha_inicio;
    temporada.fecha_fin = fecha_fin;

    await temporada.save();
    res.json(temporada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar temporada", error });
  }
};

// Activar temporada (manual)
// Activar temporada (sin desactivar otras, para múltiples activas)
exports.activarTemporada = async (req, res) => {
  try {
    const { id } = req.params;

    const temporada = await db.temporadas.findByPk(id);
    if (!temporada) {
      return res.status(404).json({ mensaje: "Temporada no encontrada" });
    }

    temporada.estado = "activa";
    await temporada.save();

    res.json({ mensaje: "Temporada activada correctamente", temporada });
  } catch (error) {
    console.error("Error al activar temporada:", error);
    res.status(500).json({ mensaje: "Error al activar temporada", error });
  }
};


exports.desactivarTemporada = async (req, res) => {
  try {
    const { id } = req.params;

    const temporada = await db.temporadas.findByPk(id);
    if (!temporada) {
      return res.status(404).json({ mensaje: "Temporada no encontrada" });
    }

    temporada.estado = "inactiva";
    await temporada.save();

    res.json({ mensaje: "Temporada desactivada correctamente", temporada });
  } catch (error) {
    console.error("Error al desactivar temporada:", error);
    res.status(500).json({ mensaje: "Error al desactivar temporada", error });
  }
};