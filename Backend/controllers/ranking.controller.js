const db = require("../models");
const Ranking = db.rankings;
const Temporada = db.temporadas;
const Estudiante = db.estudiantes;

// Guardar o actualizar posición en ranking
exports.actualizarRanking = async (req, res) => {
  try {
    const { temporadaId } = req.body;

    // Obtener estudiantes ordenados por totalCC
    const estudiantes = await Estudiante.findAll({
      order: [["totalCC", "DESC"]],
    });

    // Guardar posiciones en la tabla ranking
    const rankingData = await Promise.all(
      estudiantes.map(async (estudiante, index) => {
        return await Ranking.upsert({
          temporadaId,
          estudianteId: estudiante.id,
          totalCC: estudiante.totalCC,
          posicion: index + 1,
        });
      })
    );

    res.json({ mensaje: "Ranking actualizado correctamente", rankingData });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar ranking", error });
  }
};

// Obtener ranking actual (última temporada activa)
exports.obtenerRankingActual = async (req, res) => {
  try {
    const temporada = await Temporada.findOne({ where: { estado: "activa" } });

    if (!temporada) {
      return res.status(404).json({ mensaje: "No hay temporada activa" });
    }

    const ranking = await Ranking.findAll({
      where: { temporadaId: temporada.id },
      include: [{ model: Estudiante, as: "estudiante" }],
      order: [["posicion", "ASC"]],
    });

    res.json({ temporada: temporada.nombre, ranking });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener ranking actual", error });
  }
};

// Obtener ranking por ID de temporada
exports.obtenerRankingPorTemporada = async (req, res) => {
  try {
    const { temporadaId } = req.params;

    const temporada = await Temporada.findByPk(temporadaId);
    if (!temporada) {
      return res.status(404).json({ mensaje: "Temporada no encontrada" });
    }

    const ranking = await Ranking.findAll({
      where: { temporadaId },
      include: [{ model: Estudiante, as: "estudiante" }],
      order: [["posicion", "ASC"]],
    });

    res.json({ temporada: temporada.nombre, ranking });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener ranking de temporada", error });
  }
};

exports.obtenerRanking = async (req, res) => {
  try {
    // Obtener estudiantes ordenados por CC coins
    const ranking = await Estudiante.findAll({
      attributes: [
        'id',
        'nombre',
        [sequelize.fn('SUM', sequelize.col('moneda_ccs.cantidad')), 'cc_coins'],
        [sequelize.fn('COUNT', sequelize.col('logros.id')), 'total_logros'],
        [sequelize.fn('MAX', sequelize.col('moneda_ccs.fecha')), 'ultima_actualizacion']
      ],
      include: [
        { model: MonedaCC, attributes: [] },
        { model: Logro, attributes: [] }
      ],
      group: ['Estudiante.id'],
      order: [[sequelize.literal('cc_coins'), 'DESC']]
    });

    res.json(ranking);
  } catch (error) {
    console.error("Error al obtener ranking:", error);
    res.status(500).json({ mensaje: "Error al obtener ranking", error });
  }
};