import { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import PropTypes from 'prop-types';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaTrophy, 
  FaCalendarAlt 
} from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";


const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <Card className="stat-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className={`icon-circle bg-${color} bg-opacity-10`}>
            {Icon && <Icon size={24} className={`text-${color}`} />}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};


StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'info', 'danger', 'secondary']).isRequired
};

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalEstudiantes: 0,
    totalDocentes: 0,
    totalLogros: 0,
    temporadasActivas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {

        const estudiantesRes = await axiosInstance.get('/estudiantes/obtener');
        const totalEstudiantes = estudiantesRes.data.length;


        const docentesRes = await axiosInstance.get('/docentes/obtener');
        const totalDocentes = docentesRes.data.length;


        const logrosRes = await axiosInstance.get('/logros/obtener');
        const totalLogros = logrosRes.data.length;

        // Fetch active seasons
        const temporadaRes = await axiosInstance.get('/temporadas/activa');
        const temporadasActivas = temporadaRes.data ? 1 : 0;

        setStats({
          totalEstudiantes,
          totalDocentes,
          totalLogros,
          temporadasActivas
        });
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main className="p-4">
          <h1 className="mb-4">Panel de Administración</h1>
          
          <Row className="g-4">
            <Col xs={12} md={6} xl={3}>
              <StatCard
                title="Total Estudiantes"
                value={stats.totalEstudiantes}
                icon={FaUserGraduate}
                color="primary"
              />
            </Col>
            <Col xs={12} md={6} xl={3}>
              <StatCard
                title="Total Docentes"
                value={stats.totalDocentes}
                icon={FaChalkboardTeacher}
                color="success"
              />
            </Col>
            <Col xs={12} md={6} xl={3}>
              <StatCard
                title="Logros Disponibles"
                value={stats.totalLogros}
                icon={FaTrophy}
                color="warning"
              />
            </Col>
            <Col xs={12} md={6} xl={3}>
              <StatCard
                title="Temporadas Activas"
                value={stats.temporadasActivas}
                icon={FaCalendarAlt}
                color="info"
              />
            </Col>
          </Row>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
