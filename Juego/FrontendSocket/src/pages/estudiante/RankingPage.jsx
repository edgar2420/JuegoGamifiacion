import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import { FaTrophy, FaMedal, FaCoins } from "react-icons/fa";
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
      setRanking(response.data.ranking);
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

  const getMedalColor = (position) => {
    switch (position) {
      case 1:
        return "text-warning";
      case 2:
        return "text-secondary";
      case 3:
        return "text-brown";
      default:
        return "text-muted";
    }
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
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Posición</th>
                        <th>Estudiante</th>
                        <th>CC Coins</th>
                        <th>Logros</th>
                        <th>Última Actualización</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((estudiante, index) => (
                        <tr
                          key={estudiante.id}
                          className={
                            estudiante.id === user.estudianteId ? "table-primary" : ""
                          }
                        >
                          <td>
                            <span className={getMedalColor(index + 1)}>
                              {index < 3 ? <FaMedal size={20} /> : index + 1}
                            </span>
                          </td>
                          <td>{estudiante.nombre}</td>
                          <td>
                            <FaCoins className="text-warning me-2" />
                            {estudiante.cc_coins}
                          </td>
                          <td>
                            <FaTrophy className="text-success me-2" />
                            {estudiante.total_logros}
                          </td>
                          <td>
                            {new Date(estudiante.ultima_actualizacion).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
