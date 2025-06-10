const path = require("path");
const fs = require("fs");
const db = require("../models");
const Tarea = db.tareas;
const Estudiante = db.estudiantes;
const MonedaCC = db.moneda_cc;
const EstudianteLogro = db.estudiante_logros;
const Logro = db.logros;
const Docente = db.docentes;
const { Op } = db.Sequelize;

// Registrar una entrega de tarea (crear tarea individual)
exports.registrarTarea = async (req, res) => {
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
};

// Consultar historial de tareas por estudiante
exports.obtenerTareasPorEstudiante = async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      where: { estudianteId: req.params.id },
      include: [
        {
          model: Docente,
          as: "docente",
          attributes: ["id", "nombre"]
        }
      ],
      order: [["fecha_inicio", "DESC"]]
    });

    res.json(tareas);
  } catch (error) {
    console.error("Error al obtener tareas por estudiante:", error);
    res.status(500).json({ mensaje: "Error al obtener tareas", error });
  }
};

// Consultar todas las tareas (uso general o administrativo)
exports.obtenerTodasLasTareas = async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      include: [
        {
          model: db.estudiantes,
          as: "estudiante",
          attributes: ["id", "nombre"]
        },
        {
          model: db.docentes,
          as: "docente",
          attributes: ["id", "nombre"]
        }
      ],
      order: [["fecha_inicio", "DESC"]]
    });

    res.json(tareas);
  } catch (error) {
    console.error("Error al obtener todas las tareas:", error);
    res.status(500).json({ mensaje: "Error al obtener tareas", error });
  }
};

// Crear tarea para TODOS los estudiantes
exports.crearTareaParaTodos = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { titulo, fecha_inicio, fecha_fin, docenteId } = req.body;

    if (!titulo || !fecha_inicio || !fecha_fin || !docenteId) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    // Validar que el docente existe
    const docente = await Docente.findByPk(docenteId);
    if (!docente) {
      return res.status(400).json({ mensaje: "Docente no válido" });
    }

    const estudiantes = await db.estudiantes.findAll();

    if (estudiantes.length === 0) {
      return res.status(404).json({ mensaje: "No hay estudiantes registrados" });
    }

    console.log(`Asignando tarea "${titulo}" a ${estudiantes.length} estudiantes`);

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
    console.error("Error al crear tareas masivas:", error);
    await transaction.rollback();
    res.status(500).json({ mensaje: "Error al asignar tareas", error });
  }
};

// Estudiante sube su tarea (archivo)
exports.entregarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findByPk(req.params.id);
    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    if (!req.files || !req.files.archivo) {
      return res.status(400).json({ mensaje: "No se subió ningún archivo" });
    }

    const archivo = req.files.archivo;
    const extensionesPermitidas = [".zip", ".rar", ".pdf", ".docx", ".doc", ".xlsx", ".xls"];
    const ext = path.extname(archivo.name).toLowerCase();

    if (!extensionesPermitidas.includes(ext)) {
      return res.status(400).json({ mensaje: "Tipo de archivo no permitido" });
    }

    const nombreArchivo = `${Date.now()}-${archivo.name}`;
    const rutaDestino = path.join(__dirname, "..", "public", "entregas");

    // Crear la carpeta si no existe
    if (!fs.existsSync(rutaDestino)) {
      fs.mkdirSync(rutaDestino, { recursive: true });
    }

    const rutaFinal = path.join(rutaDestino, nombreArchivo);

    // Mover el archivo y actualizar la base de datos
    archivo.mv(rutaFinal, async (err) => {
      if (err) {
        console.error("Error al mover el archivo:", err);
        return res.status(500).json({ mensaje: "Error al guardar archivo" });
      }

      // ✅ ACTUALIZA correctamente el campo del modelo
      tarea.estado = "entregada";
      tarea.archivoEntrega = nombreArchivo; // <--- CAMPO CORRECTO
      await tarea.save();

      return res.json({ mensaje: "Tarea entregada correctamente", archivo: nombreArchivo });
    });
  } catch (error) {
    console.error("Error al entregar tarea:", error);
    res.status(500).json({ mensaje: "Error interno al entregar tarea", error });
  }
};

// Actualizar estado de la tarea (calificar)
exports.calificarTarea = async (req, res) => {
  try {
    const { estado, comentario, errores } = req.body;
    const tareaId = req.params.id;

    const tarea = await Tarea.findByPk(tareaId);

    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    if (tarea.estado !== "entregada") {
      return res.status(400).json({ mensaje: "Solo se pueden calificar tareas entregadas" });
    }

    // Actualizar campos
    tarea.estado = estado;
    tarea.comentario = comentario;
    tarea.errores = errores;
    await tarea.save();

    // Asignar ClassCoins
    let cantidad = 0;

    if (estado === "correcta") {
      cantidad = 1;
    } else if (estado === "tarde" || (estado === "con_errores" && errores <= 3)) {
      cantidad = 0.5;
    } else if (estado === "con_errores" && errores > 3) {
      cantidad = 0;
    }

    if (cantidad > 0) {
      await MonedaCC.create({
        cantidad,
        motivo: "tarea",
        fecha: new Date(),
        estudianteId: tarea.estudianteId
      });

      const estudiante = await Estudiante.findByPk(tarea.estudianteId);
      estudiante.totalCC += cantidad;
      estudiante.racha = estado === "correcta" ? estudiante.racha + 1 : 0;
      await estudiante.save();
    }

    res.json({ mensaje: "Tarea calificada correctamente", tarea });
  } catch (error) {
    console.error("Error al calificar tarea:", error);
    res.status(500).json({ mensaje: "Error al calificar tarea", error });
  }
};