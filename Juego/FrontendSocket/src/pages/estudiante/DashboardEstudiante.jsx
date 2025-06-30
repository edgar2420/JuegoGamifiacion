import { useEffect, useState } from "react";
import { FaTrophy, FaExclamationTriangle, FaCheck, FaClock } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import TareaCard from "../../components/TareaCard";
import { useNavigate } from "react-router-dom";

const DashboardEstudiante = () => {
  const [tareas, setTareas] = useState([]);
  const [logros, setLogros] = useState([]);
  const [stats, setStats] = useState({
    totalCC: 0,
    totalLogros: 0
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {

    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    cargarDatosEstudiante();
  }, []);

  const cargarDatosEstudiante = async () => {
    try {
      setIsLoading(true);
      if (!user || !user.id) {
        setError("No hay usuario logueado");
        return;
      }

      console.log("Cargando datos para usuario:", user);


      const estudianteId = user.estudianteId;

      const [tareasRes, logrosRes, monedasRes] = await Promise.all([

        axiosInstance.get(`/tareas/por-estudiante/${estudianteId}`),

        axiosInstance.get(`/logros/por-estudiante/${estudianteId}`),

        axiosInstance.get(`/monedas/por-estudiante/${estudianteId}`)
      ]);

      console.log("Respuesta tareas:", tareasRes.data);
      console.log("Respuesta logros:", logrosRes.data);
      console.log("Respuesta monedas:", monedasRes.data);


      const tareasValidadas = Array.isArray(tareasRes.data) ? tareasRes.data : [];
      const logrosValidados = Array.isArray(logrosRes.data) ? logrosRes.data : [];

      setTareas(tareasValidadas);
      setLogros(logrosValidados);
      setStats({
        totalCC: monedasRes.data?.totalCC  || 0,
        totalLogros: logrosValidados.length
      });

    } catch (err) {
      console.error("Error al cargar datos del estudiante:", err);
      setError("Error al cargar los datos del estudiante");
    } finally {
      setIsLoading(false);
    }
  };


  const tareasPendientes = tareas.filter(t => t.estado === null || t.estado === 'pendiente').length;
  const tareasEntregadas = tareas.filter(t => t.estado === "entregada").length;
  const tareasCorrectas = tareas.filter(t => t.estado === "correcta").length;
  const tareasConError = tareas.filter(t => t.estado === "con_errores").length;

  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <Navbar />
        <main className="container-fluid py-4 overflow-auto">

          <div className="row mb-4 align-items-center">
            <div className="col-md-8">
              <h1 className="fw-bold">¡Bienvenido, {user.nombre}!</h1>
              <p className="lead mb-0">
                CC Coins Totales: <span className="fw-bold text-warning">{stats.totalCC}</span> | 
                Logros Desbloqueados: <span className="fw-bold text-success">{stats.totalLogros}</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}


          <div className="row mb-4">
            <div className="col">
              <h2 className="h4 fw-bold mb-3">Estado de Tareas</h2>
              <div className="row row-cols-1 row-cols-md-5 g-4">
                <div className="col">
                  <div className="card h-100 border-warning">
                    <div className="card-body">
                      <h3 className="card-title fs-5 text-warning">
                        <FaClock className="me-2" />
                        Pendientes
                      </h3>
                      <p className="display-5 fw-bold">{tareasPendientes}</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100 border-info">
                    <div className="card-body">
                      <h3 className="card-title fs-5 text-info">
                        <FaCheck className="me-2" />
                        Entregadas
                      </h3>
                      <p className="display-5 fw-bold">{tareasEntregadas}</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100 border-success">
                    <div className="card-body">
                      <h3 className="card-title fs-5 text-success">
                        <FaCheck className="me-2" />
                        Correctas
                      </h3>
                      <p className="display-5 fw-bold">{tareasCorrectas}</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100 border-danger">
                    <div className="card-body">
                      <h3 className="card-title fs-5 text-danger">
                        <FaExclamationTriangle className="me-2" />
                        Con Errores
                      </h3>
                      <p className="display-5 fw-bold">{tareasConError}</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100 border-dark">
                    <div className="card-body">
                      <h3 className="card-title fs-5">
                        <FaTrophy className="me-2" />
                        Total
                      </h3>
                      <p className="display-5 fw-bold">{tareas.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row mb-4">
            <div className="col">
              <h2 className="h4 fw-bold mb-3">Últimos Logros</h2>
              <div className="row row-cols-1 row-cols-md-4 g-4">
                {logros.map((logro) => (
                  <div className="col" key={logro.id}>
                    <div className="card h-100 border-success">
                      <div className="card-body">
                        <h3 className="card-title fs-5 text-success">
                          <FaTrophy className="me-2" />
                          {logro.logro?.nombre || 'Logro'}
                        </h3>
                        <p className="card-text text-muted">
                          {logro.logro?.descripcion}
                        </p>
                        <small className="text-muted">
                          Conseguido el {new Date(logro.fecha_obtenido).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 fw-bold mb-0">Mis Tareas</h2>
                {isLoading && (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                )}
              </div>

              {tareas.length === 0 && !isLoading ? (
                <div className="alert alert-info" role="alert">
                  No tienes tareas asignadas por el momento.
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-md-2 g-4">
                  {tareas.map((tarea) => (
                    <div className="col" key={tarea.id}>
                      <TareaCard tarea={tarea} onUpdate={cargarDatosEstudiante} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardEstudiante;