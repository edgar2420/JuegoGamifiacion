import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import TareaCard from "../../components/TareaCard";

const DashboardEstudiante = () => {
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      const res = await axiosInstance.get(`/tareas/por-estudiante/${user.id}`);
      setTareas(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar tareas");
    }
  };

  // Contadores
  const tareasPendientes = tareas.filter((t) => t.estado === "pendiente").length;
  const tareasEntregadas = tareas.filter((t) => t.estado === "entregada").length;
  const tareasCorrectas = tareas.filter((t) => t.estado === "correcta").length;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Dashboard Estudiante</h1>
          <p>Bienvenido a tu panel de estudiante.</p>
          <p>Aquí puedes consultar tu perfil, tus tareas, ranking y logros.</p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{ marginTop: "2rem" }}>
            <h2>Resumen de Tareas</h2>
            <ul>
              <li>
                📋 Tareas pendientes: <strong>{tareasPendientes}</strong>
              </li>
              <li>
                📥 Tareas entregadas: <strong>{tareasEntregadas}</strong>
              </li>
              <li>
                ✅ Tareas correctas: <strong>{tareasCorrectas}</strong>
              </li>
              <li>
                🗂 Total de tareas asignadas: <strong>{tareas.length}</strong>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h2>Mis Tareas</h2>
            {tareas.length === 0 ? (
              <p>No tienes tareas asignadas por el momento.</p>
            ) : (
              tareas.map((tarea) => (
                <TareaCard key={tarea.id} tarea={tarea} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardEstudiante;
