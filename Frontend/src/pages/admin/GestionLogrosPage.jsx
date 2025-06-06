import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { obtenerLogros, crearLogro, eliminarLogro } from "../../api/logro";
import Button from "../../components/Button";

const GestionLogrosPage = () => {
  const [logros, setLogros] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "racha",
    requisitos: "",
  });
  const [error, setError] = useState("");

  // Cargar logros al iniciar
  useEffect(() => {
    cargarLogros();
  }, []);

  const cargarLogros = async () => {
    try {
      const res = await obtenerLogros();
      setLogros(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener logros");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await crearLogro(formData);
      setFormData({
        nombre: "",
        descripcion: "",
        tipo: "racha",
        requisitos: "",
      });
      setError("");
      await cargarLogros();
    } catch (err) {
      console.error(err);
      setError("Error al crear logro");
    }
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este logro?")) {
      try {
        await eliminarLogro(id);
        await cargarLogros();
      } catch (err) {
        console.error(err);
        setError("Error al eliminar logro");
      }
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Gestión de Logros</h1>

          <h2>Crear nuevo logro</h2>
          <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Descripción:</label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Tipo:</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                required
              >
                <option value="racha">Racha</option>
                <option value="reto">Reto</option>
                <option value="participacion">Participación</option>
              </select>
            </div>
            <div>
              <label>Requisitos:</label>
              <input
                type="text"
                name="requisitos"
                value={formData.requisitos}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit">Crear Logro</Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>

          <h2>Lista de logros</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Requisitos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {logros.map((logro) => (
                <tr key={logro.id} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                  <td>{logro.nombre}</td>
                  <td>{logro.descripcion}</td>
                  <td>{logro.tipo}</td>
                  <td>{logro.requisitos}</td>
                  <td>
                    <Button onClick={() => handleEliminar(logro.id)}>Eliminar</Button>
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

export default GestionLogrosPage;
