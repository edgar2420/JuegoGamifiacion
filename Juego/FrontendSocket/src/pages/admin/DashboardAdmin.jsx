import { useState, useEffect } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";
import {
  FaUserCog,
  FaChalkboardTeacher,
  FaTrophy,
  FaCalendarAlt
} from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

// Componente de tarjeta
const StatCard = ({ title, description, icon: Icon, color, onClick }) => (
  <Card
    className="stat-card h-100 shadow-sm border-0"
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="text-muted">{title}</h6>
        <div className={`icon-circle bg-${color} bg-opacity-10`}>
          {Icon && <Icon size={24} className={`text-${color}`} />}
        </div>
      </div>
      <p className="text-secondary small mb-0">{description}</p>
    </Card.Body>
  </Card>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

const DashboardAdmin = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Se puede mantener si más adelante querés validar datos del backend
    const fetchStats = async () => {
      try {
        await Promise.all([
          axiosInstance.get("/estudiantes/obtener"),
          axiosInstance.get("/docentes/obtener"),
          axiosInstance.get("/logros/obtener"),
          axiosInstance.get("/temporadas/activa"),
        ]);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
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
                title="Gestión de Usuarios"
                description="Administra estudiantes y docentes del sistema"
                icon={FaUserCog}
                color="primary"
                onClick={() => navigate("/admin/usuarios")}
              />
            </Col>
            <Col xs={12} md={6} xl={3}>
              <StatCard
                title="Gestión de Logros"
                description="Visualiza y crea logros para los estudiantes"
                icon={FaTrophy}
                color="warning"
                onClick={() => navigate("/admin/logros")}
              />
            </Col>
            <Col xs={12} md={6} xl={3}>
              <StatCard
                title="Gestión de Temporadas"
                description="Controla la apertura y cierre de ciclos de competencia"
                icon={FaCalendarAlt}
                color="info"
                onClick={() => navigate("/admin/temporadas")}
              />
            </Col>
            <Col xs={12} md={6} xl={3}>
              <StatCard
                title="Ranking Global"
                description="Consulta el ranking actualizado de estudiantes"
                icon={FaChalkboardTeacher}
                color="success"
                onClick={() => navigate("/admin/ranking")}
              />
            </Col>
          </Row>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
