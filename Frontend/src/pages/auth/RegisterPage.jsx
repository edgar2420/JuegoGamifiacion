import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { crearUsuario } from "../../api/usuario";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "estudiante",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await crearUsuario(form);
      alert("Usuario registrado correctamente. Ahora inicia sesión.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensaje || "Error al registrar usuario");
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
                type="text"
                className="form-control custom-input"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre completo"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              <label htmlFor="nombre">Nombre completo</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control custom-input"
                id="correo"
                name="correo"
                placeholder="ejemplo@correo.com"
                value={form.correo}
                onChange={handleChange}
                required
              />
              <label htmlFor="correo">Correo electrónico</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control custom-input"
                id="contrasena"
                name="contrasena"
                placeholder="Contraseña"
                value={form.contrasena}
                onChange={handleChange}
                required
              />
              <label htmlFor="contrasena">Contraseña</label>
            </div>

            <div className="form-floating mb-4">
              <select
                className="form-select custom-input"
                id="rol"
                name="rol"
                value={form.rol}
                onChange={handleChange}
              >
                <option value="estudiante">Estudiante</option>
                <option value="docente">Docente</option>
                <option value="admin">Administrador</option>
              </select>
              <label htmlFor="rol">Tipo de usuario</label>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100 py-2">
              Registrarse
            </button>

            <div className="text-center mt-3">
              <Link to="/login" className="text-primary text-decoration-none">
                Ya tengo cuenta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
