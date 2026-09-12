import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import CommanderLogin from "./pages/CommanderLogin";
import ModulePlaceholderPage from "./pages/ModulePlaceholderPage";
import { isAuthenticated } from "./services/authService";

/**
 * Command-centre routes are lazily loaded: they pull in Leaflet and Recharts,
 * which the landing page and login screen have no need for.
 */
const CommandShell = lazy(() => import("./components/layout/CommandShell"));
const CommandCenterPage = lazy(() => import("./pages/CommandCenterPage"));
const ExposurePage = lazy(() => import("./pages/ExposurePage"));
const HabitationsPage = lazy(() => import("./pages/HabitationsPage"));
const RelocationPage = lazy(() => import("./pages/RelocationPage"));
const CandidateSitesPage = lazy(() => import("./pages/CandidateSitesPage"));
const IncidentsPage = lazy(() => import("./pages/IncidentsPage"));
const CitizenLogin = lazy(() => import("./pages/CitizenLogin"));
const CitizenDashboard = lazy(() => import("./pages/CitizenDashboard"));

/**
 * Frontend route guard.
 *
 * This is a UX convenience, not a security boundary — the prototype session
 * lives in localStorage and can be set by anyone with a browser console. Real
 * authorisation must be enforced server-side once the backend exists.
 */
function RequireCommander({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/commander-login" replace state={{ from: location }} />;
  }

  return children;
}

function RouteFallback() {
  return (
    <div className="route-fallback" role="status">
      <span className="route-spinner" aria-hidden="true" />
      Loading command centre…
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/commander-login" element={<CommanderLogin />} />

        <Route path="/citizen/login" element={<CitizenLogin />} />
        <Route path="/citizen" element={<CitizenDashboard />} />

        <Route
          path="/commander"
          element={
            <RequireCommander>
              <CommandShell />
            </RequireCommander>
          }
        >
          <Route index element={<CommandCenterPage mode="overview" />} />
          <Route
            path="hazards"
            element={<CommandCenterPage mode="hazard" />}
          />
          <Route path="exposure" element={<ExposurePage />} />
          <Route path="habitations" element={<HabitationsPage />} />
          <Route path="relocation" element={<RelocationPage />} />

          <Route path="sites" element={<CandidateSitesPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route
            path="alerts"
            element={
              <ModulePlaceholderPage
                title="Alerts & Early Warning"
                description="Advisory monitoring and dissemination."
                planned={[
                  "Rainfall, river-level and cyclone advisories",
                  "Threshold-based alerting per jurisdiction",
                  "Dissemination log and acknowledgement tracking",
                ]}
                dependsOn="Authorised IMD and CWC feeds. No feed is connected."
              />
            }
          />
          <Route
            path="reports"
            element={
              <ModulePlaceholderPage
                title="Reports & Analytics"
                description="Exportable assessment documents and aggregate analysis."
                planned={[
                  "Assessment reports carrying full data provenance",
                  "Jurisdiction-level exposure and progress analytics",
                  "Export to PDF with the prototype disclaimer attached",
                ]}
                dependsOn="Finalised assessment schema and report templates."
              />
            }
          />
          <Route
            path="simulation"
            element={
              <ModulePlaceholderPage
                title="Scenario Simulation"
                description="What-if analysis across hazard and capacity assumptions."
                planned={[
                  "Adjustable hazard intensity and rainfall scenarios",
                  "Capacity sensitivity across candidate sites",
                  "Comparison of relocation options under each scenario",
                ]}
                dependsOn="A validated hazard model. No scientific model exists yet."
              />
            }
          />
          <Route
            path="data"
            element={
              <ModulePlaceholderPage
                title="Data Management"
                description="Dataset ingestion, versioning and provenance."
                planned={[
                  "Dataset registry with source, licence and retrieval date",
                  "Processing-run history for every derived layer",
                  "Ingestion failure monitoring",
                ]}
                dependsOn="Backend ingestion pipeline and the data_sources schema."
              />
            }
          />
          <Route
            path="settings"
            element={
              <ModulePlaceholderPage
                title="System Settings"
                description="Users, roles, jurisdictions and platform configuration."
                planned={[
                  "User and role administration",
                  "Jurisdiction scoping for state and district officers",
                  "Audit log review",
                ]}
                dependsOn="Real authentication and row-level security."
              />
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
