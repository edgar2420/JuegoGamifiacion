import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Card, ListGroup, Alert } from "react-bootstrap";
import { FaTrophy, FaMedal, FaStar } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/Button";

const LogrosEstudiantePage = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [logrosDisponibles, setLogrosDisponibles] = useState([]);
  const [logros, setLogros] = useState([]);
  const [estudianteId, setEstudianteId] = useState("");
  const [logroId, setLogroId] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarEstudiantes();
    cargarLogrosDisponibles();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const res = await axiosInstance.get("/estudiantes/obtener");
      setEstudiantes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarLogrosDisponibles = async () => {
    try {
      const res = await axiosInstance.get("/logros/obtener");
      setLogrosDisponibles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getLogroIcon = (tipo) => {
    switch (tipo) {
      case 'racha': return <FaStar className="text-warning" />;
      case 'reto': return <FaTrophy className="text-success" />;
      case 'participacion': return <FaMedal className="text-info" />;
      default: return <FaTrophy className="text-dark" />;
    }
  };

  const cargarLogros = async () => {
    try {
      if (estudianteId) {
        const res = await axiosInstance.get(`/logros/por-estudiante/${estudianteId}`);
        setLogros(res.data);
        setMensaje("");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error al cargar los logros");
    }
  };

  const asignarLogro = async () => {
    if (!estudianteId || !logroId) {
      setMensaje("Debes seleccionar un estudiante y un logro.");
      return;
    }
    try {
      await axiosInstance.post("/logros/asociar-estudiante", {
        estudianteId,
        logroId,
      });
      setMensaje("Logro asignado exitosamente.");
      cargarLogros();
    } catch (err) {
      console.error(err);
      setMensaje("Error al asignar logro.");
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <Container fluid className="p-4">
          <h1 className="mb-4 text-dark">Logros por Estudiante</h1>

          <Row className="g-4">
            <Col md={6}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white py-3">
                  <h5 className="mb-0">Asignar Nuevo Logro</h5>
                </Card.Header>
                <Card.Body>
                  {mensaje && (
                    <Alert 
                      variant={mensaje.includes("Error") ? "danger" : "success"}
                      dismissible
                      onClose={() => setMensaje("")}
                    >
                      {mensaje}
                    </Alert>
                  )}

                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Estudiante</Form.Label>
                      <Form.Select
                        value={estudianteId}
                        onChange={(e) => {
                          setEstudianteId(e.target.value);
                          if (e.target.value) cargarLogros();
                        }}
                      >
                        <option value="">Seleccione un estudiante...</option>
                        {estudiantes.map((est) => (
                          <option key={est.id} value={est.id}>
                            {est.nombre}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Logro a asignar</Form.Label>
                      <Form.Select
                        value={logroId}
                        onChange={(e) => setLogroId(e.target.value)}
                      >
                        <option value="">Seleccione un logro...</option>
                        {logrosDisponibles.map((logro) => (
                          <option key={logro.id} value={logro.id}>
                            {getLogroIcon(logro.tipo)} {logro.nombre} - {logro.tipo}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button
                        variant="dark"
                        onClick={asignarLogro}
                        disabled={!estudianteId || !logroId}
                      >
                        <FaTrophy className="me-2" />
                        Asignar Logro
                      </Button>
                      <Button
                        variant="outline-dark"
                        onClick={cargarLogros}
                        disabled={!estudianteId}
                      >
                        Actualizar Lista
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white py-3">
                  <h5 className="mb-0">Logros Obtenidos</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {logros.length > 0 ? (
                      logros.map((logro) => (
                        <ListGroup.Item 
                          key={logro.id}
                          className="d-flex align-items-center py-3"
                        >
                          <div className="me-3">
                            {getLogroIcon(logro.tipo)}
                          </div>
                          <div>
                            <h6 className="mb-0">{logro.nombre}</h6>
                            <small className="text-muted">
                              {logro.tipo} - Obtenido el {new Date(logro.fecha_obtenido).toLocaleDateString()}
                            </small>
                          </div>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item className="text-center py-4 text-muted">
                        {estudianteId ? "No hay logros para mostrar" : "Seleccione un estudiante para ver sus logros"}
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LogrosEstudiantePage;
