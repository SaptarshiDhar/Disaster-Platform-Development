import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CommanderLogin from "./pages/CommanderLogin";
import CommanderDashboard from "./pages/CommanderDashboard";

function ProtectedCommanderRoute({ children }) {
  const loggedIn = localStorage.getItem("sih_commander_logged_in");

  if (loggedIn !== "true") {
    return <Navigate to="/commander-login" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/commander-login"
        element={<CommanderLogin />}
      />

      <Route
        path="/commander"
        element={
          <ProtectedCommanderRoute>
            <CommanderDashboard />
          </ProtectedCommanderRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;