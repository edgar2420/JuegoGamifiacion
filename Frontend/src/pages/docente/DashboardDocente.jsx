import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Row, Col, Table } from 'react-bootstrap';
import { FaUserGraduate, FaTasks, FaTrophy, FaCheck } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";


const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="h-100 shadow-sm border-0">
    <Card.Body className="d-flex align-items-center">
      <div className={`icon-circle bg-${color} bg-opacity-10 me-3`}>
        {Icon && <Icon size={24} className={`text-${color}`} />}
      </div>
      <div>
        <h6 className="text-muted mb-1">{title}</h6>
        <h3 className="mb-0">{value}</h3>
      </div>
    </Card.Body>
  </Card>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
};

const DashboardDocente = () => {
  const [stats, setStats] = useState({
    totalEstudiantes: 0,
    tareasAsignadas: 0,
    tareasCompletadas: 0,
    logrosDisponibles: 0
  });
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tareasRes, estudiantesRes, logrosRes] = await Promise.all([
          axiosInstance.get('/tareas/todas'),
          axiosInstance.get('/estudiantes/obtener'),
          axiosInstance.get('/logros/obtener')
        ]);

        const tareasCompletadas = tareasRes.data.filter(tarea => 
          tarea.estado === 'completada'
        ).length;

        setStats({
          totalEstudiantes: estudiantesRes.data.length,
          tareasAsignadas: tareasRes.data.length,
          tareasCompletadas,
          logrosDisponibles: logrosRes.data.length
        });

        setTareas(tareasRes.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <div className="container-fluid p-4">
          <h1 className="mb-4 text-dark">Dashboard Docente</h1>
          
          <Row className="g-4 mb-4">
            <Col xs={12} md={6} xl={3}>
              <StatCard
                title="Total Estudiantes"
                value={stats.totalEstudiantes}
                icon={FaUserGraduate}
                color="dark"
              />
            </Col>
            <Col xs={12} md={6} xl={3}>
              <StatCard
                title="Tareas Asignadas"
                value={stats.tareasAsignadas}
                icon={FaTasks}
                color="success"
              />
            </Col>
            <Col xs={12} md={6} xl={3}>
              <StatCard
                title="Tareas Completadas"
                value={stats.tareasCompletadas}
                icon={FaCheck}
                color="info"
              />
            </Col>
            <Col xs={12} md={6} xl={3}>
              <StatCard
                title="Logros Disponibles"
                value={stats.logrosDisponibles}
                icon={FaTrophy}
                color="warning"
              />
            </Col>
          </Row>

          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white py-3">
              <h5 className="mb-0">Últimas Tareas Asignadas</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover bordered>
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>Título</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tareas.map((tarea) => (
                      <tr key={tarea.id}>
                        <td>{tarea.titulo}</td>
                        <td>{new Date(tarea.fecha_inicio).toLocaleDateString()}</td>
                        <td>{new Date(tarea.fecha_fin).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${
                            tarea.estado === 'completada' ? 'bg-success' : 
                            tarea.estado === 'pendiente' ? 'bg-warning' : 
                            'bg-danger'
                          }`}>
                            {tarea.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardDocente;
