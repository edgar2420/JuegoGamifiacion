import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/Button";

const AsignarTareasPage = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    fecha_inicio: "",
    fecha_fin: ""
  });
  const [error, setError] = useState("");
  const [tareas, setTareas] = useState([]);
  const [docenteId, setDocenteId] = useState(null);
  const [hoy, setHoy] = useState("");

  useEffect(() => {
    const fechaHoy = new Date().toISOString().split("T")[0];
    setHoy(fechaHoy);
    obtenerPerfilDocente();
    cargarTareas();
  }, []);

  const obtenerPerfilDocente = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axiosInstance.get(`/docentes/obtenerPerfil/${user.id}`);
      setDocenteId(res.data.id);
    } catch (err) {
      console.error("Error al obtener perfil del docente:", err);
      setError("Error al obtener perfil del docente");
    }
  };

  const cargarTareas = async () => {
    try {
      const res = await axiosInstance.get("/tareas/todas");
      setTareas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.fecha_fin < formData.fecha_inicio) {
      alert("La fecha de entrega no puede ser anterior a la fecha de inicio.");
      return;
    }

    try {
      if (!docenteId) {
        alert("No se pudo obtener el perfil del docente.");
        return;
      }

      await axiosInstance.post("/tareas/crear-docente", {
        ...formData,
        docenteId
      });

      setFormData({ titulo: "", fecha_inicio: "", fecha_fin: "" });
      setError("");
      alert("Tarea asignada a todos los estudiantes correctamente");
      await cargarTareas();
    } catch (err) {
      console.error(err);
      setError("Error al asignar tarea");
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <main className="p-3 overflow-auto">
          <h1 className="mb-4">Asignar Tareas</h1>

          <form onSubmit={handleSubmit} className="mb-4 card p-3">
            <div className="mb-3">
              <label className="form-label">Título:</label>
              <input
                type="text"
                className="form-control"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha de inicio:</label>
              <input
                type="date"
                className="form-control"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                min={hoy}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha de fin:</label>
              <input
                type="date"
                className="form-control"
                name="fecha_fin"
                value={formData.fecha_fin}
                min={formData.fecha_inicio || hoy}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="btn btn-primary">
              Asignar Tarea
            </Button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>

          <h2 className="mb-3">Listado de Tareas Asignadas</h2>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Título</th>
                  <th>Fecha de inicio</th>
                  <th>Fecha de entrega</th>
                  <th>Estudiante</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tareas.map((tarea) => (
                  <tr key={tarea.id}>
                    <td>{tarea.titulo}</td>
                    <td>{tarea.fecha_inicio}</td>
                    <td>{tarea.fecha_entrega}</td>
                    <td>{tarea.estudiante?.nombre}</td>
                    <td>{tarea.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AsignarTareasPage;
