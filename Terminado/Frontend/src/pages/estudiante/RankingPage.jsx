import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import {
  FaTrophy,
  FaMedal,
  FaAward,
  FaStar,
  FaBolt,
  FaCrown,
  FaCoins
} from "react-icons/fa";
import socket from "../../api/socket";

const RankingPage = () => {
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const cargarRanking = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/ranking/actual");
      setRanking(response.data);
    } catch (err) {
      console.error("Error al cargar ranking:", err);
      setError("No se pudo cargar el ranking");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarRanking();
    socket.on("rankingActualizado", () => {
      console.log("📡 Ranking actualizado por socket (estudiante)");
      cargarRanking();
    });
    return () => socket.off("rankingActualizado");
  }, []);

  const getRankingIcon = (position) => {
    const icons = {
      1: <FaTrophy className="text-warning" size={20} />,
      2: <FaMedal className="text-secondary" size={20} />,
      3: <FaAward className="text-bronze" size={20} />,
      4: <FaStar className="text-primary" size={18} />,
      5: <FaStar className="text-info" size={18} />,
      6: <FaStar className="text-success" size={18} />,
      7: <FaBolt className="text-warning" size={18} />,
      8: <FaBolt className="text-danger" size={18} />,
      9: <FaCrown className="text-warning" size={18} />,
      10: <FaCrown className="text-secondary" size={18} />
    };
    return icons[position] || <span>{position}</span>;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible";
    const date = new Date(fecha);
    return isNaN(date.getTime())
      ? "No disponible"
      : date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main className="container-fluid py-4">
          <div className="row mb-4">
            <div className="col">
              <h1 className="h2 fw-bold">Ranking Actual</h1>
              <p className="lead">Clasificación basada en CC Coins acumulados</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Posición</th>
                        <th>Estudiante</th>
                        <th>CC Coins</th>
                        <th>Logros</th>
                        <th>Última Actualización</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.slice(0, 10).map((estudiante, index) => (
                        <tr
                          key={estudiante.id}
                          className={
                            estudiante.id === user.estudianteId ? "table-primary" : ""
                          }
                        >
                          <td>{getRankingIcon(index + 1)}</td>
                          <td>{estudiante.nombre}</td>
                          <td>
                            <FaCoins className="text-warning me-2" />
                            {parseFloat(estudiante.cc_coins || 0).toFixed(1)}
                          </td>
                          <td>
                            <FaTrophy className="text-success me-2" />
                            {estudiante.total_logros ?? 0}
                          </td>
                          <td>{formatearFecha(estudiante.ultima_actualizacion)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {ranking.length > 10 && (
                    <div className="text-muted small mt-2">
                      Mostrando solo los primeros 10 estudiantes.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RankingPage;
