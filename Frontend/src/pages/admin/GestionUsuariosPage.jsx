import { useEffect, useState } from "react";
import { Card, Form, Table, Container, Row, Col, Alert } from 'react-bootstrap';
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
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <Container fluid className="p-4">
          <h1 className="mb-4 text-dark">Gestión de Usuarios</h1>

          <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-dark text-white py-3">
              <h5 className="mb-0">Crear nuevo usuario</h5>
            </Card.Header>
            <Card.Body className="bg-white">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Correo electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rol</Form.Label>
                      <Form.Select
                        name="rol"
                        value={formData.rol}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="estudiante">Estudiante</option>
                        <option value="docente">Docente</option>
                        <option value="admin">Administrador</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                <div className="text-end">
                  <Button type="submit" variant="dark">
                    <i className="bi bi-person-plus me-2"></i>
                    Crear Usuario
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white py-3">
              <h5 className="mb-0">Lista de usuarios</h5>
            </Card.Header>
            <Card.Body className="bg-white">
              <div className="table-responsive">
                <Table hover bordered>
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.correo}</td>
                        <td>
                          <span className={`badge ${
                            usuario.rol === 'admin' ? 'bg-dark' : 
                            usuario.rol === 'docente' ? 'bg-success' : 
                            'bg-secondary'
                          }`}>
                            {usuario.rol}
                          </span>
                        </td>
                        <td className="text-center">
                          <Button 
                            variant="dark"
                            size="sm"
                            onClick={() => handleEliminar(usuario.id)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default GestionUsuariosPage;
