import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import { Container, Table, Button, Alert, Badge, Form, Modal } from "react-bootstrap";

const TareasPage = () => {
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const extensionesPermitidas = [".zip", ".rar", ".pdf", ".docx", ".doc", ".xlsx", ".xls"];
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      setIsLoading(true);
      const estudianteId = user.estudianteId;
      const res = await axiosInstance.get(`/tareas/por-estudiante/${estudianteId}`);
      setTareas(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar tareas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    const extension = file ? file.name.split(".").pop().toLowerCase() : "";

    if (!extensionesPermitidas.includes(`.${extension}`)) {
      setModalMessage("Tipo de archivo no permitido. Debe ser zip, rar, pdf, docx, xls, etc.");
      setShowModal(true);
      setArchivo(null);
      return;
    }

    setArchivo(file);
  };

  const handleEntregar = async (tareaId) => {
    if (!archivo) {
      setModalMessage("Debe seleccionar un archivo válido.");
      setShowModal(true);
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

      setModalMessage("Tarea entregada correctamente");
      setShowModal(true);
      setArchivo(null);
      setTareaSeleccionada(null);
      await cargarTareas();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || "Error al entregar tarea";
      setModalMessage(msg);
      setShowModal(true);
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "pendiente":
        return <Badge bg="warning" text="dark">Pendiente</Badge>;
      case "entregada":
        return <Badge bg="info">Entregada</Badge>;
      case "correcta":
        return <Badge bg="success">Correcta</Badge>;
      case "incorrecta":
        return <Badge bg="danger">Incorrecta</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <Navbar />
        <main className="container-fluid py-4 overflow-auto">
          <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h2 fw-bold">Mis Tareas</h1>
              {isLoading && (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              )}
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {tareas.length === 0 && !isLoading ? (
              <Alert variant="info">No tienes tareas asignadas por el momento.</Alert>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover className="align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Título</th>
                      <th>Fecha de entrega</th>
                      <th>Estado</th>
                      <th>Archivo entregado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tareas.map((tarea) => (
                      <tr key={tarea.id}>
                        <td>{tarea.titulo}</td>
                        <td>
                          {new Date(tarea.fecha_entrega).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </td>
                        <td>{getEstadoBadge(tarea.estado)}</td>
                        <td>
                          {tarea.archivoEntrega ? (
                            <Button
                              variant="link"
                              size="sm"
                              href={`http://localhost:3000/entregas/${tarea.archivoEntrega}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="bi bi-download me-1"></i>Descargar
                            </Button>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {tarea.estado === "pendiente" &&
                            tareaSeleccionada !== tarea.id ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setTareaSeleccionada(tarea.id)}
                            >
                              <i className="bi bi-upload me-1"></i>Entregar
                            </Button>
                          ) : tareaSeleccionada === tarea.id ? (
                            <div>
                              <Form.Group controlId={`formFile-${tarea.id}`} className="mb-2">
                                <Form.Label className="d-block small">Seleccionar archivo:</Form.Label>
                                <Form.Control type="file" onChange={handleArchivoChange} size="sm" />
                              </Form.Group>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleEntregar(tarea.id)}
                                  disabled={!archivo}
                                >
                                  <i className="bi bi-check-circle me-1"></i>Subir
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setArchivo(null);
                                    setTareaSeleccionada(null);
                                  }}
                                >
                                  <i className="bi bi-x-circle me-1"></i>Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Container>
        </main>
      </div>

      {/* Modal para mensajes */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TareasPage;
