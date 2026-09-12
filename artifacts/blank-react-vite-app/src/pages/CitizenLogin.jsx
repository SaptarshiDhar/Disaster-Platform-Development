import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";

import "../styles/citizen.css";

/**
 * Citizen Login — frontend only, static demo data.
 *
 * No Supabase / real auth / OTP yet. LOG IN and Continue with OTP simply
 * navigate to /citizen; every other control is a placeholder interaction
 * until the citizen backend lands.
 */

const QUICK_ACCESS = [
  {
    icon: BookOpen,
    tone: "tone-green",
    title: "View Safety Guides",
    subtitle: "What to do before, during, after",
  },
  {
    icon: Phone,
    tone: "tone-blue",
    title: "Emergency Contacts",
    subtitle: "Helplines, hospitals, key services",
  },
  {
    icon: Download,
    tone: "tone-orange",
    title: "Offline Emergency Pack",
    subtitle: "Maps, guides, contacts (offline)",
  },
];

function CitizenLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/citizen");
  };

  return (
    <div className="citizen-app">
      <div className="citizen-shell">
        <header className="citizen-login-header">
          <svg
            className="citizen-mountains"
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="0,160 90,60 180,160" fill="#c9d9ec" />
            <polygon points="120,160 240,40 360,160" fill="#d6e3f0" />
            <polygon points="260,160 330,90 400,160" fill="#c9d9ec" />
          </svg>

          <div className="citizen-brand-row">
            <div className="citizen-brand">
              <div className="citizen-shield" aria-hidden="true" />
              <div>
                <h1>RAKSHA</h1>
                <p>Citizen Login</p>
              </div>
            </div>

            <div className="citizen-tagline-side">
              <p>Safer Communities</p>
              <p>Stronger Tomorrows</p>
              <div className="citizen-tagline-underline" />
            </div>
          </div>

          <p className="citizen-tagline">
            Secure access to alerts, reports, and offline emergency tools.
          </p>
        </header>

        <div className="citizen-content">
          <section className="citizen-card">
            <h2>Welcome Back</h2>
            <p>Log in to your RAKSHA Citizen account.</p>

            <form className="citizen-form" onSubmit={handleSubmit}>
              <label className="citizen-field">
                <Mail size={18} aria-hidden="true" />
                <span className="sr-only">Mobile Number or Email</span>
                <input
                  type="text"
                  placeholder="Mobile Number / Email"
                  autoComplete="username"
                />
              </label>

              <label className="citizen-field">
                <Lock size={18} aria-hidden="true" />
                <span className="sr-only">Password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>

              <label className="citizen-checkbox-row">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(event) => setKeepSignedIn(event.target.checked)}
                />
                Keep me signed in on this device
              </label>

              <button type="submit" className="citizen-btn-primary">
                LOG IN
              </button>

              <button
                type="button"
                className="citizen-btn-otp"
                onClick={() => navigate("/citizen")}
              >
                Continue with OTP
              </button>
            </form>

            <div className="citizen-links-row">
              <button type="button">Forgot Password?</button>
              <button type="button">Create New Account</button>
            </div>
          </section>

          <section className="citizen-section">
            <div className="citizen-section-head">
              <h3>Quick Access</h3>
              <span>Available without login</span>
            </div>

            <div className="citizen-quick-grid">
              {QUICK_ACCESS.map(({ icon: Icon, tone, title, subtitle }) => (
                <button key={title} type="button" className="citizen-quick-card">
                  <span className={`citizen-icon-badge ${tone}`}>
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="title-row">
                    {title}
                    <ChevronRight size={13} aria-hidden="true" />
                  </span>
                  <p>{subtitle}</p>
                </button>
              ))}
            </div>
          </section>

          <button type="button" className="citizen-emergency-banner">
            <span className="icon-circle">
              <TriangleAlert size={16} aria-hidden="true" />
            </span>
            <span className="text">
              <strong>Emergency? Get help fast</strong>
              <span>View helplines and critical information</span>
            </span>
            <ChevronRight size={18} className="chevron" aria-hidden="true" />
          </button>

          <footer className="citizen-disclaimer">
            <ShieldAlert size={16} aria-hidden="true" />
            <p>
              For citizen reporting and safety information only. Not for
              emergency response. In a life-threatening situation, call the
              appropriate official emergency service.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default CitizenLogin;
