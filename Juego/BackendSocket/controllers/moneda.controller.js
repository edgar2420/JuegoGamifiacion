const db = require("../models");
const MonedaCC = db.moneda_cc;
const Estudiante = db.estudiantes;

exports.obtenerMonedasPorEstudiante = async (req, res) => {
  try {
    const monedas = await db.moneda_cc.findAll({
      where: { estudianteId: req.params.id },
      attributes: ['id', 'cantidad', 'motivo', 'fecha', 'tareaId']
    });

    const totalCC = monedas.reduce((sum, m) => sum + (m.cantidad || 0), 0);

    res.json({
      totalCC,     // ✅ Agregado
      monedas      // ✅ Retornamos también las transacciones si las necesitás
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener monedas", error });
  }
};


// Crear moneda manual
exports.crearMonedaManual = async (req, res) => {
  try {
    const { cantidad, motivo, estudianteId } = req.body;

    const estudiante = await Estudiante.findByPk(estudianteId);
    if (!estudiante) {
      return res.status(404).json({ mensaje: "Estudiante no encontrado" });
    }

    await MonedaCC.create({
      cantidad,
      motivo,
      fecha: new Date(),
      estudianteId
    });

    // Actualizar totalCC
    estudiante.totalCC += cantidad;
    await estudiante.save();

    res.json({ mensaje: "Moneda creada correctamente" });
  } catch (error) {
    console.error("Error al crear moneda:", error);
    res.status(500).json({ mensaje: "Error al crear moneda", error });
  }
};
