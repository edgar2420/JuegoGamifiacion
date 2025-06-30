import { useEffect, useState } from "react";
import { obtenerPerfil } from "../api/estudiante";

const PerfilEstudiante = ({ estudianteId }) => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await obtenerPerfil(estudianteId);
        setPerfil(data);
      } catch (error) {
        console.error("Error al obtener el perfil", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [estudianteId]);

  if (loading) return <p>Cargando perfil...</p>;
  if (!perfil) return <p>No se encontró el perfil del estudiante.</p>;

  const { estudiante, logros, monedas } = perfil;

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h3>Perfil del Estudiante</h3>
      <p><strong>Nombre:</strong> {estudiante.nombre}</p>
      <p><strong>Correo:</strong> {estudiante.correo}</p>
      <p><strong>Total CC:</strong> {estudiante.totalCC}</p>
      <p><strong>Racha:</strong> {estudiante.racha}</p>

      <h4>Monedas</h4>
      <p>
        {monedas.length > 0
          ? monedas.reduce((total, moneda) => total + moneda.cantidad, 0)
          : 0}{" "}
        monedas
      </p>

      <h4>Logros</h4>
      <ul>
        {logros.map((logro) => (
          <li key={logro.id}>{logro.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default PerfilEstudiante;
