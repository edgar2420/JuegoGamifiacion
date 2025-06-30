import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import TemporadasGestion from "../../components/TemporadasGestion";

const GestionTemporadasPage = () => {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <div className="container-fluid p-4">
          <div className="row">
            <div className="col">
              <h1 className="mb-4 text-dark">Gestión de Temporadas</h1>
              
              <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white py-3">
                  <h5 className="mb-0">Administración de Temporadas</h5>
                </div>
                <div className="card-body bg-white">
                  <TemporadasGestion />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionTemporadasPage;