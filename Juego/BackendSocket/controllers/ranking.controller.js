const db = require("../models");
const Ranking = db.rankings;
const Temporada = db.temporadas;
const Estudiante = db.estudiantes;
const MonedaCC = db.moneda_cc;
const Logro = db.logros;
const { fn, col, literal } = db.Sequelize;

// 🔁 Guardar o actualizar posición en ranking
exports.actualizarRanking = async (req, res) => {
  try {
    const { temporadaId } = req.body;

    // Obtener estudiantes ordenados por totalCC
    const estudiantes = await Estudiante.findAll({
      order: [["totalCC", "DESC"]],
    });

    // Guardar posiciones en la tabla ranking
    const rankingData = await Promise.all(
      estudiantes.map((est, index) =>
        Ranking.upsert({
          temporadaId,
          estudianteId: est.id,
          totalCC: est.totalCC,
          posicion: index + 1,
        })
      )
    );

    // 🔥 Emitir evento por socket.io
    const io = req.app.get("io");

    const rankingActualizado = await Ranking.findAll({
      where: { temporadaId },
      include: [{ model: Estudiante, as: "estudiante" }],
      order: [["posicion", "ASC"]],
    });

    io.emit("rankingActualizado", rankingActualizado);

    res.json({ mensaje: "Ranking actualizado correctamente", ranking: rankingActualizado });
  } catch (error) {
    console.error("Error en actualizarRanking:", error);
    res.status(500).json({ mensaje: "Error al actualizar ranking", error });
  }
};

// 📦 Obtener ranking actual (última temporada activa)
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
    console.error("Error en obtenerRankingActual:", error);
    res.status(500).json({ mensaje: "Error al obtener ranking actual", error });
  }
};

// 📦 Obtener ranking por ID de temporada
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
    console.error("Error en obtenerRankingPorTemporada:", error);
    res.status(500).json({ mensaje: "Error al obtener ranking de temporada", error });
  }
};

// 📊 Ranking general acumulado (sin importar temporada)
exports.obtenerRanking = async (req, res) => {
  try {
    const ranking = await Estudiante.findAll({
      attributes: [
        'id',
        'nombre',
        [fn('SUM', col('moneda_ccs.cantidad')), 'cc_coins'],
        [fn('COUNT', col('logros.id')), 'total_logros'],
        [fn('MAX', col('moneda_ccs.fecha')), 'ultima_actualizacion']
      ],
      include: [
        { model: MonedaCC, as: "monedas", attributes: [] },
        { model: Logro, as: "logros", attributes: [] }
      ],
      group: ['estudiantes.id'],
      order: [[literal('cc_coins'), 'DESC']]
    });

    res.json(ranking);
  } catch (error) {
    console.error("Error en obtenerRanking general:", error);
    res.status(500).json({ mensaje: "Error al obtener ranking", error });
  }
};
