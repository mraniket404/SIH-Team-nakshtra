import {
  Routes,
  Route,
} from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import NewAnalysis from "../pages/NewAnalysis";
import AnalysisWorkspace from "../pages/AnalysisWorkspace";
import AnalysisResult from "../pages/AnalysisResult";
import Projects from "../pages/Projects";
import ProjectDetails from "../pages/ProjectDetails";
import History from "../pages/History";
import Models from "../pages/Models";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

import MainLayout from "../components/layout/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* PROTECTED */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/analysis/new"
            element={<NewAnalysis />}
          />

          <Route
            path="/analysis/workspace"
            element={<AnalysisWorkspace />}
          />

          <Route
            path="/analysis/:id"
            element={<AnalysisResult />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />
         <Route
            path="/projects/:id"
            element={<ProjectDetails />}
          />
          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/models"
            element={<Models />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;