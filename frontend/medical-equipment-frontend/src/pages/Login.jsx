import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MediTrackLogo from "../components/MediTrackLogo";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your username or email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-bg-shapes">
        <div className="login-bg-circle c1" />
        <div className="login-bg-circle c2" />
        <div className="login-bg-circle c3" />
      </div>

      <div className="login-container">
        {/* Left panel - branding */}
        <div className="login-brand-panel">
          <div className="login-brand-content">
            <MediTrackLogo size={64} light />
            <h1>MediTrack Pro</h1>
            <p className="login-tagline">Smarter Medical Equipment Management</p>
            <div className="login-features">
              <div className="login-feature">
                <span className="login-feature-icon">📊</span>
                <div>
                  <strong>Real-time Dashboard</strong>
                  <p>Monitor equipment status and inventory at a glance</p>
                </div>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">🔧</span>
                <div>
                  <strong>Maintenance Tracking</strong>
                  <p>Schedule and track maintenance with smart alerts</p>
                </div>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">📋</span>
                <div>
                  <strong>Detailed Reports</strong>
                  <p>Generate and export comprehensive inventory reports</p>
                </div>
              </div>
            </div>
          </div>
          <p className="login-brand-footer">© 2026 MediTrack Pro · ISE Department Project</p>
        </div>

        {/* Right panel - login form */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <div className="login-form-logo-mobile">
                <MediTrackLogo size={36} />
              </div>
              <h2>Welcome back</h2>
              <p>Sign in to access your equipment management dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="login-username">Username or Email</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">👤</span>
                  <input
                    id="login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="login-password">Password</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">🔒</span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error" role="alert">
                  <span>⚠</span>
                  {error}
                </div>
              )}

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
