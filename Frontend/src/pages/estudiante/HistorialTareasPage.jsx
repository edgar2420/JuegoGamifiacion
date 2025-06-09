import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";

const HistorialTareasPage = () => {
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      const res = await axiosInstance.get("/tareas/todas");
      setTareas(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar tareas");
    }
  };

  const calificarTarea = async (tareaId, nuevoEstado) => {
    try {
      await axiosInstance.put(`/tareas/calificar/${tareaId}`, {
        estado: nuevoEstado
      });

      alert("Tarea calificada correctamente.");
      await cargarTareas();
    } catch (err) {
      console.error(err);
      alert("Error al calificar tarea.");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Historial de Tareas</h1>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Estudiante</th>
                <th>Fecha de entrega</th>
                <th>Estado</th>
                <th>Archivo entregado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <tr
                  key={tarea.id}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #ddd"
                  }}
                >
                  <td>{tarea.titulo}</td>
                  <td>{tarea.estudiante?.nombre}</td>
                  <td>{tarea.fecha_entrega}</td>
                  <td>{tarea.estado}</td>
                  <td>
                    {tarea.archivoEntrega ? (
                      <a
                        href={`http://localhost:3000/entregas/${tarea.archivoEntrega}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver archivo
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {tarea.estado === "entregada" ? (
                      <>
                        <button
                          style={{ marginRight: "5px" }}
                          onClick={() => calificarTarea(tarea.id, "correcta")}
                        >
                          Correcta
                        </button>
                        <button
                          style={{ marginRight: "5px" }}
                          onClick={() => calificarTarea(tarea.id, "tarde")}
                        >
                          Tarde
                        </button>
                        <button
                          onClick={() => calificarTarea(tarea.id, "con_errores")}
                        >
                          Con Errores
                        </button>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default HistorialTareasPage;
