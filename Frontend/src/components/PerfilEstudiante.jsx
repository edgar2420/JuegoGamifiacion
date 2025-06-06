const PerfilEstudiante = ({ estudiante }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h3>Perfil del Estudiante</h3>
      <p><strong>Nombre:</strong> {estudiante.nombre}</p>
      <p><strong>Correo:</strong> {estudiante.correo}</p>
      <p><strong>Total CC:</strong> {estudiante.totalCC}</p>
      <p><strong>Racha:</strong> {estudiante.racha}</p>
    </div>
  );
};

export default PerfilEstudiante;
