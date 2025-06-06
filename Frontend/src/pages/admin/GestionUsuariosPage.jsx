import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { obtenerUsuarios, crearUsuario, eliminarUsuario } from "../../api/usuario";
import Button from "../../components/Button";

const GestionUsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "estudiante",
  });
  const [error, setError] = useState("");

  // Cargar usuarios al iniciar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await obtenerUsuarios();
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener usuarios");
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
      await crearUsuario(formData);
      setFormData({
        nombre: "",
        correo: "",
        contrasena: "",
        rol: "estudiante",
      });
      setError("");
      await cargarUsuarios();
    } catch (err) {
      console.error(err);
      setError("Error al crear usuario");
    }
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await eliminarUsuario(id);
        await cargarUsuarios();
      } catch (err) {
        console.error(err);
        setError("Error al eliminar usuario");
      }
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Gestión de Usuarios</h1>

          <h2>Crear nuevo usuario</h2>
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
              <label>Correo:</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Contraseña:</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Rol:</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="docente">Docente</option>
                <option value="estudiante">Estudiante</option>
              </select>
            </div>
            <Button type="submit">Crear Usuario</Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>

          <h2>Lista de usuarios</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <Button onClick={() => handleEliminar(usuario.id)}>Eliminar</Button>
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

export default GestionUsuariosPage;
