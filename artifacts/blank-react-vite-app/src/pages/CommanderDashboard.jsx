import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

function CommanderDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("sih_commander_logged_in");
    localStorage.removeItem("sih_user");

    navigate("/");
  };

  return (
    <div className="dashboard-placeholder">
      <div>
        <ShieldCheck size={55} />

        <h1>NDRF Command Center</h1>

        <p>
          Login successful. The India-wide GIS disaster intelligence
          dashboard will be built here next.
        </p>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default CommanderDashboard;
