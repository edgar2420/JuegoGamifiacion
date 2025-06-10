import PerfilEstudiante from "../../components/PerfilEstudiante";

const PerfilPage = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const estudianteId = usuario?.id;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <PerfilEstudiante estudianteId={estudianteId} />
    </div>
  );
};

export default PerfilPage;
