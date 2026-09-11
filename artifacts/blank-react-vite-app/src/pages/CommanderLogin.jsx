import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";

import { login } from "../services/authService";

/**
 * Commander sign-in.
 *
 * Prototype authentication only — see src/services/authService.js. The form
 * talks to that service rather than to localStorage directly, so replacing it
 * with Supabase Auth or the project backend touches one module.
 */
function CommanderLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [commanderId, setCommanderId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname ?? "/commander";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await login({ commanderId, password });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="login-page">
      <button
        type="button"
        className="login-back"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back
      </button>

      <main className="login-card">
        <div className="login-emblem" aria-hidden="true">
          <ShieldCheck size={34} />
        </div>

        <span className="login-sih">SIH26191</span>
        <p className="login-kicker">AUTHORIZED PERSONNEL ACCESS</p>

        <h1>NDRF / SDMA Commander</h1>
        <p className="login-subtitle">
          Sign in to access the Disaster Intelligence Command Center.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="commander-id">Commander ID / Official Email</label>
            <div className="login-input">
              <User size={17} aria-hidden="true" />
              <input
                id="commander-id"
                type="text"
                autoComplete="username"
                value={commanderId}
                onChange={(event) => setCommanderId(event.target.value)}
                placeholder="Enter Commander ID"
                aria-invalid={Boolean(error)}
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="commander-password">Password</label>
            <div className="login-input">
              <Lock size={17} aria-hidden="true" />
              <input
                id="commander-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                aria-invalid={Boolean(error)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={17} aria-hidden="true" />
                ) : (
                  <Eye size={17} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error ? (
            <p className="login-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Access Command Center"}
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="login-note">
          Prototype mode: authentication is simulated in the frontend. Any
          non-empty credentials are accepted. Backend authentication will
          replace this during integration.
        </p>
      </main>
    </div>
  );
}

export default CommanderLogin;
