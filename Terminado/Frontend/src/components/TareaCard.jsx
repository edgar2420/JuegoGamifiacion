const TareaCard = ({ tarea }) => {
  const estadoTexto = tarea.estado || "pendiente";

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case "entregada":
        return "info";
      case "correcta":
        return "success";
      case "con_errores":
        return "danger";
      case "tarde":
        return "warning";
      case "pendiente":
      default:
        return "secondary";
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "0.5rem",
      }}
    >
      <h4>{tarea.titulo}</h4>

      <p>
        <strong>Estado:</strong>{" "}
        <span className={`badge bg-${obtenerColorEstado(estadoTexto)}`}>
          {estadoTexto}
        </span>
      </p>

      <p>
        <strong>Fecha de entrega:</strong>{" "}
        {new Date(tarea.fecha_entrega).toLocaleDateString()}
      </p>

      <p>
        <strong>Archivo:</strong>{" "}
        {tarea.archivoEntrega ? (
          <a
            href={`http://localhost:3000/entregas/${tarea.archivoEntrega}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver archivo
          </a>
        ) : (
          <span className="text-muted">No entregado</span>
        )}
      </p>
    </div>
  );
};

export default TareaCard;
