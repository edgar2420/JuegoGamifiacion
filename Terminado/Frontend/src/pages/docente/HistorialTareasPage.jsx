import { useEffect, useState } from "react";
import { Card, Form, Table, Container, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/Button";
import { FaCoins } from "react-icons/fa";

const HistorialTareasPage = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [temporadasPorTarea, setTemporadasPorTarea] = useState({});
  const [estudianteId, setEstudianteId] = useState("");
  const [calificaciones, setCalificaciones] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [errores, setErrores] = useState({});
  const [monedas, setMonedas] = useState({});

  useEffect(() => {
    cargarEstudiantes();
    cargarTemporadas();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const res = await axiosInstance.get("/estudiantes/obtener");
      setEstudiantes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarTemporadas = async () => {
    try {
      const res = await axiosInstance.get("/temporadas/activa");
      setTemporadas(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarMonedas = async (estudianteId) => {
    try {
      const res = await axiosInstance.get(`/monedas/por-estudiante/${estudianteId}`);
      const monedas = res.data.monedas || [];
      const monedasPorTarea = monedas.reduce((acc, moneda) => {
        if (moneda.motivo === "tarea" && moneda.tareaId) {
          acc[moneda.tareaId] = moneda.cantidad;
        }
        return acc;
      }, {});
      setMonedas(monedasPorTarea);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarTareas = async () => {
    try {
      if (estudianteId) {
        const [tareasRes] = await Promise.all([
          axiosInstance.get(`/tareas/por-estudiante/${estudianteId}`),
          cargarMonedas(estudianteId),
        ]);
        setTareas(tareasRes.data);
        setCalificaciones({});
        setComentarios({});
        setErrores({});
        setTemporadasPorTarea({});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeEstado = (tareaId, estado) => {
    setCalificaciones({ ...calificaciones, [tareaId]: estado });
  };

  const handleChangeComentario = (tareaId, comentario) => {
    setComentarios({ ...comentarios, [tareaId]: comentario });
  };

  const handleChangeErrores = (tareaId, numErrores) => {
    setErrores({ ...errores, [tareaId]: numErrores });
  };

  const handleChangeTemporada = (tareaId, temporadaId) => {
    setTemporadasPorTarea({ ...temporadasPorTarea, [tareaId]: temporadaId });
  };

  const handleCalificar = async (tareaId) => {
    const estado = calificaciones[tareaId];
    const comentario = comentarios[tareaId] || "";
    const numErrores = errores[tareaId] !== undefined ? Number(errores[tareaId]) : 0;
    const temporadaId = temporadasPorTarea[tareaId];

    if (!estado || !temporadaId) {
      alert("Debe seleccionar un estado y una temporada.");
      return;
    }

    try {
      await axiosInstance.put(`/tareas/calificar/${tareaId}`, {
        estado,
        comentario,
        errores: numErrores,
        temporadaId
      });

      alert("✅ Tarea calificada correctamente.");
      await cargarTareas();
    } catch (err) {
      console.error(err);
      alert("❌ Error al calificar tarea.");
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <Container fluid className="p-4">
          <h1 className="mb-4 text-dark">Historial de Tareas por Estudiante</h1>
          {/* SECCIÓN DE SELECCIÓN */}
          <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-dark text-white py-3">
              <h5 className="mb-0">Selección de Estudiante</h5>
            </Card.Header>
            <Card.Body>
              <Row className="align-items-end">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Seleccionar Estudiante:</Form.Label>
                    <Form.Select
                      value={estudianteId}
                      onChange={(e) => setEstudianteId(e.target.value)}
                      className="mb-0"
                    >
                      <option value="">Seleccione...</option>
                      {estudiantes.map((est) => (
                        <option key={est.id} value={est.id}>
                          {est.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Button variant="dark" onClick={cargarTareas} className="w-100">
                    <i className="bi bi-search me-2"></i> Ver Tareas
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* TABLA DE TAREAS */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white py-3">
              <h5 className="mb-0">Listado de Tareas</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover bordered>
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>Título</th>
                      <th>Fecha Entrega</th>
                      <th>Estado</th>
                      <th>Archivo</th>
                      <th>Comentario</th>
                      <th>Errores</th>
                      <th>CC COINS</th>
                      <th>Editar</th>
                      <th>Temporada</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tareas.map((tarea) => (
                      <tr key={tarea.id}>
                        <td>{tarea.titulo}</td>
                        <td>{new Date(tarea.fecha_entrega).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${
                            tarea.estado === "entregada"
                              ? "bg-warning"
                              : tarea.estado === "correcta"
                              ? "bg-success"
                              : tarea.estado === "con_errores"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}>
                            {tarea.estado}
                          </span>
                        </td>
                        <td>
                          {tarea.archivoEntrega ? (
                            <a
                              href={`http://localhost:3000/entregas/${tarea.archivoEntrega}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-link btn-sm"
                            >
                              <i className="bi bi-file-earmark-text me-1"></i> Ver archivo
                            </a>
                          ) : "-"}
                        </td>
                        <td>{tarea.comentario || "-"}</td>
                        <td>{tarea.errores ?? "-"}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaCoins className="text-warning me-2" />
                            <span>{monedas[tarea.id] !== undefined ? monedas[tarea.id] : "-"}</span>
                          </div>
                        </td>
                        <td>
                          {tarea.estado === "entregada" && (
                            <>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={comentarios[tarea.id] || ""}
                                onChange={(e) => handleChangeComentario(tarea.id, e.target.value)}
                                placeholder="Añadir comentario..."
                                className="mb-2"
                              />
                              <Form.Control
                                type="number"
                                min="0"
                                value={errores[tarea.id] || ""}
                                onChange={(e) => handleChangeErrores(tarea.id, e.target.value)}
                                placeholder="Errores"
                              />
                            </>
                          )}
                        </td>
                        <td>
                          {tarea.estado === "entregada" && (
                            <Form.Select
                              size="sm"
                              value={temporadasPorTarea[tarea.id] || ""}
                              onChange={(e) => handleChangeTemporada(tarea.id, e.target.value)}
                            >
                              <option value="">Seleccione temporada</option>
                              {temporadas.map(temp => (
                                <option key={temp.id} value={temp.id}>
                                  {temp.nombre}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        </td>
                        <td>
                          {tarea.estado === "entregada" && (
                            <>
                              <Form.Select
                                size="sm"
                                className="mb-2"
                                value={calificaciones[tarea.id] || ""}
                                onChange={(e) => handleChangeEstado(tarea.id, e.target.value)}
                              >
                                <option value="">Seleccione...</option>
                                <option value="correcta">Correcta</option>
                                <option value="tarde">Tarde</option>
                                <option value="con_errores">Con errores</option>
                              </Form.Select>
                              <Button
                                variant="dark"
                                size="sm"
                                onClick={() => handleCalificar(tarea.id)}
                              >
                                Calificar
                              </Button>
                            </>
                          )}
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

export default HistorialTareasPage;
