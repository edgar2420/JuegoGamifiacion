import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();

  const links = [];

  // Menú para Admin
  if (user?.rol === "admin") {
    links.push(
      { to: "/admin/dashboard", label: "Dashboard Admin" },
      { to: "/admin/usuarios", label: "Gestión de Usuarios" },
      { to: "/admin/logros", label: "Gestión de Logros" },
      { to: "/admin/temporadas", label: "Gestión de Temporadas" },
      { to: "/admin/ranking", label: "Ranking Global" }
    );
  }

  // Menú para Docente
  if (user?.rol === "docente") {
    links.push(
      { to: "/docente/dashboard", label: "Dashboard Docente" },
      { to: "/docente/temporadas", label: "Gestión de Temporadas" },
      { to: "/docente/desempeno", label: "Desempeño de Estudiantes" }
    );
  }

  // Menú para Estudiante
  if (user?.rol === "estudiante") {
    links.push(
      { to: "/estudiante/dashboard", label: "Dashboard Estudiante" },
      { to: "/estudiante/perfil", label: "Mi Perfil" },
      { to: "/estudiante/tareas", label: "Mis Tareas" },
      { to: "/estudiante/logros", label: "Mis Logros" },
      { to: "/estudiante/ranking", label: "Ranking Actual" }
    );
  }

  return (
    <aside
      style={{
        width: "200px",
        padding: "1rem",
        backgroundColor: "#f4f4f4",
        borderRight: "1px solid #ccc",
        height: "100vh",
      }}
    >
      <h3>Menú</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {links.map((link) => (
          <li key={link.to} style={{ marginBottom: "0.5rem" }}>
            <Link to={link.to} style={{ textDecoration: "none", color: "#333" }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
