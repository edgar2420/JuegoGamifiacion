import { useEffect, useState } from "react";
import { Card, Form, Table, Container, Row, Col, Alert } from 'react-bootstrap';
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
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <Container fluid className="p-4">
          <h1 className="mb-4 text-dark">Gestión de Logros</h1>

          <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-dark text-white py-3">
              <h5 className="mb-0">Crear nuevo logro</h5>
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
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        type="text"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="racha">Racha</option>
                        <option value="reto">Reto</option>
                        <option value="participacion">Participación</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Requisitos</Form.Label>
                      <Form.Control
                        type="text"
                        name="requisitos"
                        value={formData.requisitos}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                <div className="text-end">
                  <Button type="submit" variant="primary">
                    Crear Logro
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white py-3">
              <h5 className="mb-0">Lista de logros</h5>
            </Card.Header>
            <Card.Body className="bg-white">
              <div className="table-responsive">
                <Table hover bordered>
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Tipo</th>
                      <th>Requisitos</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logros.map((logro) => (
                      <tr key={logro.id}>
                        <td>{logro.nombre}</td>
                        <td>{logro.descripcion}</td>
                        <td>
                          <span className={`badge ${
                            logro.tipo === 'racha' ? 'bg-dark' : 
                            logro.tipo === 'reto' ? 'bg-success' : 'bg-secondary'
                          }`}>
                            {logro.tipo}
                          </span>
                        </td>
                        <td>{logro.requisitos}</td>
                        <td className="text-center">
                          <Button 
                            variant="dark"
                            size="sm"
                            onClick={() => handleEliminar(logro.id)}
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

export default GestionLogrosPage;
