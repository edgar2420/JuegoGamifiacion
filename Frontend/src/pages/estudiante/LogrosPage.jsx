import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import { FaTrophy, FaLock } from "react-icons/fa";

const LogrosPage = () => {
  const [logros, setLogros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    cargarLogros();
  }, []);

  const cargarLogros = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/logros/por-estudiante/${user.estudianteId}`);
      console.log("Logros cargados:", response.data);
      setLogros(response.data);
    } catch (err) {
      console.error("Error al cargar logros:", err);
      setError("No se pudieron cargar los logros");
    } finally {
      setIsLoading(false);
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
              <h1 className="h2 fw-bold">Mis Logros</h1>
              <p className="lead text-muted">
                Has desbloqueado {logros.length} logros hasta ahora
              </p>
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
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {logros.map((logro) => (
                <div className="col" key={logro.id}>
                  <div className="card h-100 border-success">
                    <div className="card-body">
                      <h3 className="card-title h5 text-success">
                        <FaTrophy className="me-2" />
                        {logro.logro?.nombre || logro.nombre}
                      </h3>
                      <p className="card-text">
                        {logro.logro?.descripcion || logro.descripcion}
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          Conseguido el {new Date(logro.fecha_obtenido || logro.createdAt).toLocaleDateString()}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LogrosPage;
