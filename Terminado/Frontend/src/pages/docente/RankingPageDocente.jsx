import { useEffect, useState } from "react";
import { Container, Table, Card, Form, Alert } from 'react-bootstrap';
import { FaTrophy, FaMedal, FaAward, FaClock } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import socket from "../../api/socket";

const RankingPageDocente = () => {
  const [ranking, setRanking] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [selectedTemporada, setSelectedTemporada] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Cargar historial y temporadas activas
  const cargarTemporadas = async () => {
    try {
      const [historialRes, activasRes] = await Promise.all([
        axiosInstance.get("/temporadas/historial"),
        axiosInstance.get("/temporadas/activa")
      ]);

      const historial = historialRes.data || [];
      const activas = Array.isArray(activasRes.data)
        ? activasRes.data
        : [activasRes.data].filter(Boolean);

      setTemporadas(historial);

      // Seleccionar automáticamente la primera activa si no hay una ya seleccionada
      if (!selectedTemporada && activas.length > 0) {
        const primeraActiva = activas[0];
        setSelectedTemporada(primeraActiva.id);
        cargarRanking(primeraActiva.id);
      }
    } catch (err) {
      console.error("Error al cargar temporadas:", err);
      setMensaje("Error al cargar temporadas.");
    }
  };

  // Cargar ranking por temporada
  const cargarRanking = async (temporadaId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/ranking/por-temporada/${temporadaId}`);
      setRanking(res.data.ranking);
      if (!res.data.ranking || res.data.ranking.length === 0) {
        setMensaje("Aún no hay registros en esta temporada.");
      } else {
        setMensaje("");
      }
    } catch (err) {
      console.error("Error al cargar ranking:", err);
      setRanking([]);
      setMensaje("No se pudo cargar el ranking de la temporada.");
    } finally {
      setLoading(false);
    }
  };

  // Efecto principal: inicialización y sockets
  useEffect(() => {
    cargarTemporadas();

    socket.on("rankingActualizado", () => {
      if (selectedTemporada) {
        console.log("📡 Ranking actualizado (socket)");
        cargarRanking(selectedTemporada);
      }
    });

    return () => {
      socket.off("rankingActualizado");
    };
  }, [selectedTemporada]);

  const handleTemporadaChange = async (e) => {
    const id = e.target.value;
    setSelectedTemporada(id);
    await cargarRanking(id);
  };

  const getPosicionIcon = (posicion) => {
    switch (posicion) {
      case 1: return <FaTrophy className="text-warning h3 mb-0" />;
      case 2: return <FaMedal className="text-secondary h3 mb-0" />;
      case 3: return <FaAward className="text-bronze h3 mb-0" />;
      default: return posicion;
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <Container fluid className="p-4">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">Ranking de la Clase</h5>
                  {loading && (
                    <div className="spinner-border spinner-border-sm ms-3" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  )}
                </div>
                <div className="d-flex align-items-center">
                  <FaClock className="me-2" />
                  <Form.Select
                    className="w-auto"
                    value={selectedTemporada}
                    onChange={handleTemporadaChange}
                    disabled={loading || temporadas.length === 0}
                  >
                    <option value="">Seleccione una temporada</option>
                    {temporadas.map(temp => (
                      <option key={temp.id} value={temp.id}>
                        {temp.nombre} {temp.estado === "activa" ? "(Activa)" : ""}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {mensaje && <Alert variant="info">{mensaje}</Alert>}
              {!mensaje && (
                <Table hover responsive className="align-middle mb-0">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th className="text-center" style={{ width: "100px" }}>Posición</th>
                      <th>Estudiante</th>
                      <th className="text-center">Total CC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((item, index) => (
                      <tr key={item.estudianteId}>
                        <td className="text-center">
                          {getPosicionIcon(index + 1)}
                        </td>
                        <td>{item.estudiante?.nombre}</td>
                        <td className="text-center fw-bold">
                          {item.totalCC} CC
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default RankingPageDocente;
