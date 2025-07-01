const path = require("path");
const fs = require("fs");
const db = require("../models");
const { Op } = db.Sequelize;

const Tarea = db.tareas;
const Estudiante = db.estudiantes;
const MonedaCC = db.moneda_cc;
const Docente = db.docentes;
const Ranking = db.rankings;
const Temporada = db.temporadas;

module.exports = (io) => ({
  registrarTarea: async (req, res) => {
    try {
      const { titulo, fecha_entrega, estado, estudianteId, docenteId } = req.body;

      const nuevaTarea = await Tarea.create({
        titulo,
        fecha_entrega,
        estado,
        estudianteId,
        docenteId
      });

      res.status(201).json({ mensaje: "Tarea registrada correctamente", tarea: nuevaTarea });
    } catch (error) {
      console.error("Error al registrar tarea:", error);
      res.status(500).json({ mensaje: "Error al registrar tarea", error });
    }
  },

  obtenerTareasPorEstudiante: async (req, res) => {
    try {
      const tareas = await Tarea.findAll({
        where: { estudianteId: req.params.id },
        include: [{ model: Docente, as: "docente", attributes: ["id", "nombre"] }],
        order: [["fecha_inicio", "DESC"]]
      });
      res.json(tareas);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener tareas", error });
    }
  },

  obtenerTodasLasTareas: async (req, res) => {
    try {
      const tareas = await Tarea.findAll({
        include: [
          { model: db.estudiantes, as: "estudiante", attributes: ["id", "nombre"] },
          { model: db.docentes, as: "docente", attributes: ["id", "nombre"] }
        ],
        order: [["fecha_inicio", "DESC"]]
      });
      res.json(tareas);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener tareas", error });
    }
  },

  crearTareaParaTodos: async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
      const { titulo, fecha_inicio, fecha_fin, docenteId } = req.body;

      if (!titulo || !fecha_inicio || !fecha_fin || !docenteId) {
        return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
      }

      const docente = await Docente.findByPk(docenteId);
      if (!docente) {
        return res.status(400).json({ mensaje: "Docente no válido" });
      }

      const estudiantes = await db.estudiantes.findAll();
      if (estudiantes.length === 0) {
        return res.status(404).json({ mensaje: "No hay estudiantes registrados" });
      }

      for (const est of estudiantes) {
        await db.tareas.create({
          titulo,
          fecha_inicio,
          fecha_entrega: fecha_fin,
          estado: "pendiente",
          estudianteId: est.id,
          docenteId
        }, { transaction });
      }

      await transaction.commit();
      res.status(201).json({ mensaje: "Tarea asignada a todos los estudiantes correctamente" });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ mensaje: "Error al asignar tareas", error });
    }
  },

  entregarTarea: async (req, res) => {
    try {
      const tarea = await Tarea.findByPk(req.params.id);
      if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });
      if (!req.files?.archivo) return res.status(400).json({ mensaje: "No se subió ningún archivo" });

      const archivo = req.files.archivo;
      const ext = path.extname(archivo.name).toLowerCase();
      const extensionesPermitidas = [".zip", ".rar", ".pdf", ".docx", ".doc", ".xlsx", ".xls"];

      if (!extensionesPermitidas.includes(ext)) {
        return res.status(400).json({ mensaje: "Tipo de archivo no permitido" });
      }

      const nombreArchivo = `${Date.now()}-${archivo.name}`;
      const rutaDestino = path.join(__dirname, "..", "public", "entregas");
      if (!fs.existsSync(rutaDestino)) fs.mkdirSync(rutaDestino, { recursive: true });

      archivo.mv(path.join(rutaDestino, nombreArchivo), async (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al guardar archivo" });

        tarea.estado = "entregada";
        tarea.archivoEntrega = nombreArchivo;
        await tarea.save();

        res.json({ mensaje: "Tarea entregada correctamente", archivo: nombreArchivo });
      });
    } catch (error) {
      res.status(500).json({ mensaje: "Error interno al entregar tarea", error });
    }
  },

   calificarTarea: async (req, res) => {
    try {
      const { estado, comentario, errores, temporadaId } = req.body;

      const tarea = await Tarea.findByPk(req.params.id);
      if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });
      if (tarea.estado !== "entregada") return res.status(400).json({ mensaje: "Solo se pueden calificar tareas entregadas" });

      const temporada = await Temporada.findByPk(temporadaId);
      if (!temporada || temporada.estado !== "activa") {
        return res.status(400).json({ mensaje: "Temporada no activa o no válida" });
      }

      tarea.estado = estado;
      tarea.comentario = comentario;
      tarea.errores = errores;
      await tarea.save();

      // 💰 Cálculo de CC
      let cantidad = 0;
      if (estado === "correcta") cantidad = 1.2;
      else if (estado === "tarde") cantidad = 0.5;
      else if (estado === "con_errores") {
        if (errores <= 2) cantidad = 0.5;
        else if (errores <= 4) cantidad = 0.2;
        else cantidad = 0;
      }

      if (cantidad > 0) {
        await MonedaCC.create({
          cantidad,
          motivo: "tarea",
          fecha: new Date(),
          estudianteId: tarea.estudianteId,
          tareaId: tarea.id,
          temporadaId: temporada.id
        });

        const estudiante = await Estudiante.findByPk(tarea.estudianteId);
        estudiante.totalCC += cantidad;
        estudiante.racha = estado === "correcta" ? estudiante.racha + 1 : 0;
        await estudiante.save();

        const estudiantesOrdenados = await Estudiante.findAll({
          order: [["totalCC", "DESC"]]
        });

        await Promise.all(
          estudiantesOrdenados.map((est, index) =>
            Ranking.upsert({
              estudianteId: est.id,
              totalCC: est.totalCC,
              temporadaId: temporada.id,
              posicion: index + 1
            })
          )
        );

        const rankingActualizado = await Ranking.findAll({
          where: { temporadaId: temporada.id },
          include: [{ model: Estudiante, as: "estudiante" }],
          order: [["posicion", "ASC"]]
        });

        io.emit("rankingActualizado", rankingActualizado);
      }

      res.json({ mensaje: "Tarea calificada correctamente", tarea });
    } catch (error) {
      console.error("Error al calificar tarea:", error);
      res.status(500).json({ mensaje: "Error al calificar tarea", error });
    }
  }
});