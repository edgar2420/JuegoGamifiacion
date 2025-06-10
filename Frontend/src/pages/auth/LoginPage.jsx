import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { login as loginService } from "../../api/auth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginService(correo, contrasena);

      const { usuario, token } = response.data;

      // Guardar en contexto
      login({
        ...usuario,
        token,
      });

      // Redirigir según el rol
      if (usuario.rol === "admin") {
        navigate("/admin/dashboard");
      } else if (usuario.rol === "docente") {
        navigate("/docente/dashboard");
      } else if (usuario.rol === "estudiante") {
        navigate("/estudiante/dashboard");
      } else {
        setError("Rol no válido");
      }
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="auth-container">
      <div className="brand-name">
        <span className="text-primary">Edu</span>
        <span>Class</span>
      </div>
      <div className="auth-frame">
        <div className="auth-content">
          <h1 className="auth-title">EduClass</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control custom-input"
                id="email"
                placeholder="ejemplo@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
              <label htmlFor="email">Correo electrónico</label>
            </div>
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control custom-input"
                id="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <label htmlFor="password">Contraseña</label>
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100 py-2">
              Iniciar sesión
            </button>
            <div className="text-center mt-3">
              <Link to="/register" className="text-primary text-decoration-none">
                Registrarse
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
