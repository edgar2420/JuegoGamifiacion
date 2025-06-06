const db = require("../models");
const Tarea = db.tareas;
const Estudiante = db.estudiantes;
const MonedaCC = db.moneda_cc;
const EstudianteLogro = db.estudiante_logros;
const Logro = db.logros;
const { Op } = db.Sequelize;

// Registrar una entrega de tarea 
exports.registrarTarea = async (req, res) => {
  try {
    const { titulo, fecha_entrega, estado, estudianteId, docenteId } = req.body;

    // Crear la tarea
    const nuevaTarea = await Tarea.create({
      titulo,
      fecha_entrega,
      estado,
      estudianteId,
      docenteId,
    });

    // Asignar ClassCoins según estado de la entrega
    let cantidad = 0;
    let motivo = "tarea";

    if (estado === "correcta") cantidad = 1;
    else if (estado === "tarde" || estado === "con_errores") cantidad = 0.5;

    if (cantidad > 0) {
      await MonedaCC.create({
        cantidad,
        motivo,
        fecha: new Date(),
        estudianteId,
      });

      // Sumar al totalCC del estudiante + actualizar racha
      const estudiante = await Estudiante.findByPk(estudianteId);
      estudiante.totalCC += cantidad;
      estudiante.racha = estado === "correcta" ? estudiante.racha + 1 : 0;
      await estudiante.save();
    }

    // Lógica de racha de 5 tareas consecutivas correctas
    if (estado === "correcta") {
      const tareasCorrectas = await Tarea.findAll({
        where: {
          estudianteId,
          estado: "correcta"
        },
        order: [["fecha_entrega", "DESC"]],
        limit: 5
      });

      if (tareasCorrectas.length === 5) {
        // Buscar el logro de tipo "racha"
        const logroRacha = await Logro.findOne({
          where: { tipo: "racha" }
        });

        if (logroRacha) {
          // Verificar si ya tiene el logro
          const yaTieneLogro = await EstudianteLogro.findOne({
            where: {
              estudianteId,
              logroId: logroRacha.id
            }
          });

          if (!yaTieneLogro) {
            // 1. Asignar 2 CC extra
            await MonedaCC.create({
              cantidad: 2,
              motivo: "racha",
              fecha: new Date(),
              estudianteId
            });

            // 2. Sumar al totalCC del estudiante
            const estudiante = await Estudiante.findByPk(estudianteId);
            estudiante.totalCC += 2;
            await estudiante.save();

            // 3. Asociar el logro
            await EstudianteLogro.create({
              estudianteId,
              logroId: logroRacha.id,
              fecha_obtenido: new Date()
            });

            console.log(`🎉 Estudiante ${estudianteId} logró la Racha!`);
          }
        }
      }
    }

    res.status(201).json({ mensaje: "Tarea registrada y CC asignadas", tarea: nuevaTarea });
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
      include: ["docente"]
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
      include: ["estudiante", "docente"]
    });
    res.json(tareas);
  } catch (error) {
    console.error("Error al obtener todas las tareas:", error);
    res.status(500).json({ mensaje: "Error al obtener tareas", error });
  }
};
