import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();

  const links = [];

  // Menú para Admin
  if (user?.rol === "admin") {
    links.push(
      { to: "/admin/dashboard", label: "Dashboard Admin", icon: "bi-speedometer2" },
      { to: "/admin/usuarios", label: "Gestión de Usuarios", icon: "bi-people" },
      { to: "/admin/logros", label: "Gestión de Logros", icon: "bi-trophy" },
      { to: "/admin/temporadas", label: "Gestión de Temporadas", icon: "bi-calendar" },
      { to: "/admin/ranking", label: "Ranking Global", icon: "bi-graph-up" }
    );
  }

  // Menú para Docente
  if (user?.rol === "docente") {
    links.push(
      { to: "/docente/dashboard", label: "Dashboard Docente", icon: "bi-speedometer2" },
      { to: "/docente/asignar-tareas", label: "Asignar Tareas", icon: "bi-journal-plus" },
      { to: "/docente/temporadas", label: "Gestión de Temporadas", icon: "bi-calendar" },
      { to: "/docente/ranking", label: "Ranking de la Clase", icon: "bi-graph-up" },
      { to: "/docente/historial-tareas", label: "Historial y Calificar Tareas", icon: "bi-journal-check" },
      { to: "/docente/logros-estudiante", label: "Logros por Estudiante", icon: "bi-award" }
    );
  }

  // Menú para Estudiante
  if (user?.rol === "estudiante") {
    links.push(
      { to: "/estudiante/dashboard", label: "Dashboard Estudiante", icon: "bi-speedometer2" },
      { to: "/estudiante/tareas", label: "Mis Tareas", icon: "bi-journal-text" },
      { to: "/estudiante/logros", label: "Mis Logros", icon: "bi-trophy" },
      { to: "/estudiante/ranking", label: "Ranking Actual", icon: "bi-graph-up" }
    );
  }

  return (
    <div className="p-3">
      <span className="fs-4">Menú</span>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {links.map((link) => (
          <li key={link.to} className="nav-item">
            <Link 
              to={link.to} 
              className="nav-link link-dark"
              activeClassName="active"
            >
              <i className={`bi ${link.icon} me-2`}></i>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;