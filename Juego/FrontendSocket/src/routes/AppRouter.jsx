import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Admin
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import GestionUsuariosPage from "../pages/admin/GestionUsuariosPage";
import GestionLogrosPage from "../pages/admin/GestionLogrosPage";
import GestionTemporadasPage from "../pages/admin/GestionTemporadasPage";
import RankingPageAdmin from "../pages/admin/RankingPage";

// Docente
import DashboardDocente from "../pages/docente/DashboardDocente";
import TemporadasPageDocente from "../pages/docente/TemporadasPage";
import RankingPageDocente from "../pages/docente/RankingPageDocente";
import AsignarTareasPage from "../pages/docente/AsignarTareasPage";
import HistorialTareasPage from "../pages/docente/HistorialTareasPage";
import LogrosEstudiantePage from "../pages/docente/LogrosEstudiantePage";
import DocenteCalificarTareas from "../pages/docente/DocenteCalificarTareas";

// Estudiante
import DashboardEstudiante from "../pages/estudiante/DashboardEstudiante";
import PerfilEstudiantePage from "../pages/estudiante/PerfilEstudiantePage";
import TareasPage from "../pages/estudiante/TareasPage";
import LogrosPage from "../pages/estudiante/LogrosPage";
import RankingPageEstudiante from "../pages/estudiante/RankingPage";

import MainLayout from "../layouts/MainLayout";

const AppRouter = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Login y Register público */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <DashboardAdmin />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <GestionUsuariosPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/logros"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <GestionLogrosPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/temporadas"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <GestionTemporadasPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/ranking"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <RankingPageAdmin />
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* Rutas Docente */}
          <Route
            path="/docente/dashboard"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["docente"]}>
                  <DashboardDocente />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/docente/temporadas"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["docente"]}>
                  <TemporadasPageDocente />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/docente/ranking"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["docente"]}>
                  <RankingPageDocente />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/docente/asignar-tareas"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["docente"]}>
                  <AsignarTareasPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/docente/historial-tareas"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["docente"]}>
                  <HistorialTareasPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/docente/calificar-tareas"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["docente"]}>
                  <DocenteCalificarTareas />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/docente/logros-estudiante"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["docente"]}>
                  <LogrosEstudiantePage />
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* Rutas Estudiante */}
          <Route
            path="/estudiante/dashboard"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["estudiante"]}>
                  <DashboardEstudiante />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/estudiante/perfil"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["estudiante"]}>
                  <PerfilEstudiantePage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/estudiante/tareas"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["estudiante"]}>
                  <TareasPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/estudiante/logros"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["estudiante"]}>
                  <LogrosPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/estudiante/ranking"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["estudiante"]}>
                  <RankingPageEstudiante />
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
