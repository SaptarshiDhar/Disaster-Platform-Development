import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Database,
  FileText,
  Info,
  Languages,
  Layers3,
  MapPin,
  MapPinned,
  ShieldCheck,
  TriangleAlert,
  UserCog,
  Users,
  Workflow,
} from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();

  // Inline notice rather than window.alert: the Citizen and Administrator
  // portals are deliberately out of scope for this phase.
  const [notice, setNotice] = useState("");

  const showComingSoon = (role) => {
    setNotice(`${role} portal — module planned for a later phase.`);
  };

  return (
    <div className="landing-page">
      {/* HEADER */}
      <header className="top-header">
        <div className="brand">
          <div className="brand-emblem">
            <ShieldCheck size={34} />
          </div>

          <div className="brand-divider" />

          <div>
            <div className="sih-number">SIH26191</div>

            <div className="brand-title">
              DISASTER RELOCATION
              <br />
              DECISION INTELLIGENCE PLATFORM
            </div>
          </div>
        </div>

        <nav className="main-nav">
          <a href="#about">
            <Info size={17} />
            About Platform
          </a>

          <a href="#features">
            <Layers3 size={17} />
            Key Features
          </a>

          <a href="#sources">
            <Database size={17} />
            Data Sources
          </a>

          <a href="#how-it-works">
            <Workflow size={17} />
            How It Works
          </a>

          <a href="#contact">
            <FileText size={17} />
            Contact
          </a>
        </nav>

        <button className="language-button">
          <Languages size={17} />
          English
          <span>⌄</span>
        </button>
      </header>

      {/* MAIN */}
      <main className="hero">
        <div className="background-overlay" />

        <section className="hero-left" id="about">
          <div className="hero-content">
            <h1>
              Smarter Decisions.
              <br />
              Safer Communities.
            </h1>

            <h2>
              Intelligent Identification. Risk Assessment.
              <br />
              Relocation Planning.
            </h2>

            <p className="hero-description">
              An integrated GIS-enabled decision-support platform designed
              to identify hazard-based red zones, assess vulnerable
              populations and support safer relocation planning.
            </p>

            <div className="mini-features">
              <div className="mini-feature">
                <MapPin />
                <div>
                  <strong>Multi-Hazard</strong>
                  <span>
                    Landslides, Floods,
                    <br />
                    Cloudbursts & more
                  </span>
                </div>
              </div>

              <div className="mini-feature">
                <Users />
                <div>
                  <strong>Population</strong>
                  <span>
                    Exposure & Vulnerability
                    <br />
                    Assessment
                  </span>
                </div>
              </div>

              <div className="mini-feature">
                <ShieldCheck />
                <div>
                  <strong>Relocation</strong>
                  <span>
                    Priority & Safer-Site
                    <br />
                    Recommendation
                  </span>
                </div>
              </div>

              <div className="mini-feature">
                <BarChart3 />
                <div>
                  <strong>Data-Driven</strong>
                  <span>
                    Evidence-Based
                    <br />
                    Decision Support
                  </span>
                </div>
              </div>
            </div>

            <div className="emergency-notice">
              <TriangleAlert />

              <div>
                <p>
                  This platform is designed primarily for disaster-management
                  decision support.
                </p>

                <p>
                  For emergencies, contact your appropriate local emergency
                  authority.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ROLE SELECTION */}
        <section className="hero-right">
          <div className="welcome-label">Welcome</div>

          <h3>Choose Your Role to Continue</h3>

          <div className="heading-line" />

          <div className="role-grid">
            {/* COMMANDER */}
            <article className="role-card commander-card">
              <div className="role-icon commander-icon">
                <ShieldCheck size={55} />
              </div>

              <h4>NDRF / SDMA</h4>
              <h4>Commander</h4>

              <p>
                Access the command center, view hazard intelligence,
                assess risks, plan relocations and manage operations.
              </p>

              <button
                className="role-button commander-button"
                onClick={() => navigate("/commander-login")}
              >
                Login as Commander
                <span>→</span>
              </button>
            </article>

            {/* CITIZEN */}
            <article className="role-card citizen-card">
              <div className="role-icon citizen-icon">
                <Users size={55} />
              </div>

              <h4>Citizen</h4>

              <p>
                Report incidents, receive safety information, view alerts
                and stay informed during emergency situations.
              </p>

              <button
                className="role-button citizen-button"
                onClick={() => showComingSoon("Citizen")}
              >
                Login as Citizen
                <span>→</span>
              </button>
            </article>

            {/* ADMIN */}
            <article className="role-card admin-card">
              <div className="role-icon admin-icon">
                <UserCog size={55} />
              </div>

              <h4>Administrator</h4>

              <p>
                Manage authorized users, validate information, configure
                system settings and oversee platform operations.
              </p>

              <button
                className="role-button admin-button"
                onClick={() => showComingSoon("Administrator")}
              >
                Admin Login
                <span>→</span>
              </button>
            </article>
          </div>

          {notice ? (
            <div className="role-notice" role="status">
              <Info size={16} />
              {notice}
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss notice"
              >
                &times;
              </button>
            </div>
          ) : null}

          <div className="account-notice">
            <Info size={17} />
            Authorized access will be managed by the system administrator.
          </div>
        </section>
      </main>

      {/* FEATURE STRIP */}
      <section className="feature-strip" id="features">
        <h3>Powering Smarter Disaster Management</h3>

        <div className="platform-features">
          <div className="platform-feature">
            <Layers3 />
            <span>
              Dynamic Red-Zone
              <br />
              Identification
            </span>
          </div>

          <div className="platform-feature">
            <Users />
            <span>
              Population Exposure
              <br />
              Analysis
            </span>
          </div>

          <div className="platform-feature">
            <MapPinned />
            <span>
              Safer-Site Suitability
              <br />
              & Carrying Capacity
            </span>
          </div>

          <div className="platform-feature">
            <ShieldCheck />
            <span>
              Relocation Priority
              <br />
              Assessment
            </span>
          </div>

          <div className="platform-feature">
            <BarChart3 />
            <span>
              Scenario Simulation
              <br />
              & Planning
            </span>
          </div>

          <div className="platform-feature">
            <FileText />
            <span>
              Explainable
              <br />
              Decision Support
            </span>
          </div>
        </div>
      </section>

      <footer>
        <span>SIH26191</span>
        <span className="footer-divider">|</span>
        <span>Disaster Relocation Decision Intelligence Platform</span>
      </footer>
    </div>
  );
}

export default LandingPage;