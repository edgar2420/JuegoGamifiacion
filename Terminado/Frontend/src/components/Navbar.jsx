import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          {user && (
            <button
              className="btn btn-outline-light me-2 d-lg-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebar"
            >
              <i className="bi bi-list"></i>
            </button>
          )}
          <Link
            to={user ? `/${user.rol}/dashboard` : "/"}
            className="navbar-brand mb-0 h1"
          >
            EduClass
          </Link>
        </div>

        <div className="d-flex align-items-center">
          {user ? (
            <>
              <span className="text-light me-3">
                Hola, <strong>{user.correo}</strong> ({user.rol})
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline-light"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-light me-2">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-outline-light">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
