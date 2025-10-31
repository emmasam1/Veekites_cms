import "./App.css";
import { Routes, Route } from "react-router";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardLayout from "./layout/DashboardLayout";
import Services from "./pages/services/Services";
import Project from "./pages/project/Project";
import SiteManagement from "./pages/sitesetting/SiteManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectDetails from "./pages/project/ProjectDetails";
import Team from "./pages/team/Team";

function App() {
  return (
    <Routes>
      {/* ✅ Public route */}
      <Route path="/" element={<Login />} />

      {/* ✅ Protected routes only */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="services" element={<Services />} />
        <Route path="projects" element={<Project />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="site-management" element={<SiteManagement />} />
        <Route path="team" element={<Team />} />
      </Route>
    </Routes>
  );
}

export default App;
