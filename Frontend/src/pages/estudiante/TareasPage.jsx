import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";

const TareasPage = () => {
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      // Usar el estudianteId que corresponde a la tabla tareas
      const estudianteId = user.estudianteId;

      const res = await axiosInstance.get(`/tareas/por-estudiante/${estudianteId}`);
      setTareas(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar tareas");
    }
  };

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleEntregar = async (tareaId) => {
    if (!archivo) {
      alert("Debe seleccionar un archivo primero.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      await axiosInstance.post(`/tareas/entregar/${tareaId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Tarea entregada correctamente.");
      setArchivo(null);
      setTareaSeleccionada(null);
      await cargarTareas();
    } catch (err) {
      console.error(err);
      alert("❌ Error al entregar tarea.");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Mis Tareas</h1>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {tareas.length === 0 ? (
            <p>No tienes tareas asignadas por el momento.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Título</th>
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
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <td>{tarea.titulo}</td>
                    <td>
                      {new Date(tarea.fecha_entrega).toLocaleDateString()}
                    </td>
                    <td>{tarea.estado}</td>
                    <td>
                      {tarea.archivo_entrega ? (
                        <a
                          href={`http://localhost:3000/entregas/${tarea.archivo_entrega}`}
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
                      {tarea.estado === "pendiente" &&
                      tareaSeleccionada !== tarea.id ? (
                        <button
                          onClick={() => setTareaSeleccionada(tarea.id)}
                          style={{ cursor: "pointer" }}
                        >
                          Entregar
                        </button>
                      ) : tareaSeleccionada === tarea.id ? (
                        <div>
                          <input type="file" onChange={handleArchivoChange} />
                          <button
                            onClick={() => handleEntregar(tarea.id)}
                            style={{ marginTop: "0.5rem", cursor: "pointer" }}
                          >
                            Subir
                          </button>
                          <button
                            onClick={() => {
                              setArchivo(null);
                              setTareaSeleccionada(null);
                            }}
                            style={{
                              marginLeft: "0.5rem",
                              cursor: "pointer",
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
};

export default TareasPage;
