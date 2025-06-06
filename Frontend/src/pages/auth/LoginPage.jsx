import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "100%" }}>
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
