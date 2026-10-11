
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const defaults = {
  theme: "Light",
  language: "English",
  twoFactor: true,
  mobileNotifications: true,
  desktopNotifications: true,
  emailNotifications: false,
};

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(defaults);
  const [message, setMessage] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("medicalEquipmentSettings");
      if (saved) setSettings({ ...defaults, ...JSON.parse(saved) });
    } catch {
      setSettings(defaults);
    }
  }, []);

  function update(key, value) {
    setSettings((previous) => ({ ...previous, [key]: value }));
    setMessage("");
  }

  function saveSettings() {
    try {
      localStorage.setItem(
        "medicalEquipmentSettings",
        JSON.stringify(settings)
      );
      setMessage("Settings saved successfully.");
    } catch {
      setMessage("Could not save settings in this browser.");
    }
  }

  function resetSettings() {
    setSettings(defaults);
    localStorage.setItem("medicalEquipmentSettings", JSON.stringify(defaults));
    setMessage("Default settings restored.");
  }

  const toggles = [
    ["twoFactor", "Two-factor Authentication", "Extra account security preference"],
    ["mobileNotifications", "Mobile Push Notifications", "Equipment and inventory alerts"],
    ["desktopNotifications", "Desktop Notifications", "Show alerts while using the application"],
    ["emailNotifications", "Email Notifications", "Receive important updates by email"],
  ];

  return (
    <main className={`settings-page ${settings.theme === "Dark" ? "settings-dark" : ""}`}>
      <header className="settings-header">
        <div>
          <span className="settings-kicker">PREFERENCES</span>
          <h1>Settings</h1>
          <p>Customize your Medical Equipment Management System.</p>
        </div>
        <button className="settings-secondary" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </header>

      <section className="settings-panel">
        <h2>Appearance & Language</h2>
        <p className="settings-panel-subtitle">Personalize your experience.</p>

        <div className="settings-row">
          <div><h3>Appearance</h3><p>Choose the theme for this page.</p></div>
          <select value={settings.theme} onChange={(e) => update("theme", e.target.value)}>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>

        <div className="settings-row">
          <div><h3>Language</h3><p>Select your preferred language.</p></div>
          <select value={settings.language} onChange={(e) => update("language", e.target.value)}>
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>
        </div>
      </section>

      <section className="settings-panel">
        <h2>Security & Notifications</h2>
        <p className="settings-panel-subtitle">Manage your notification preferences.</p>

        {toggles.map(([key, title, description]) => (
          <div className="settings-row" key={key}>
            <div><h3>{title}</h3><p>{description}</p></div>
            <button
              type="button"
              role="switch"
              aria-checked={settings[key]}
              aria-label={title}
              className={`settings-toggle ${settings[key] ? "active" : ""}`}
              onClick={() => update(key, !settings[key])}
            >
              <span />
            </button>
          </div>
        ))}
        <p className="settings-note">
          These switches save preferences only; they do not activate real two-factor
          authentication or send push/email notifications.
        </p>
      </section>

      <section className="settings-panel">
        <h2>Notices & Articles</h2>
        <article className="settings-notice">
          <div className="settings-notice-title">
            <span>📢</span>
            <div><h3>Equipment Maintenance Reminder</h3><p>System notice</p></div>
          </div>
          <p>
            Keep equipment records up to date. Review availability, equipment
            condition, quantities, and maintenance requirements regularly.
          </p>
          {noticeOpen && (
            <ul>
              <li>Check equipment status and availability.</li>
              <li>Update equipment locations and quantities.</li>
              <li>Record equipment that needs maintenance.</li>
              <li>Review inventory records for accuracy.</li>
            </ul>
          )}
          <button className="settings-save" onClick={() => setNoticeOpen(!noticeOpen)}>
            {noticeOpen ? "Show less ↑" : "Read more →"}
          </button>
        </article>
      </section>

      <footer className="settings-footer">
        <span role="status">{message}</span>
        <div>
          <button className="settings-secondary" onClick={resetSettings}>Reset Defaults</button>
          <button className="settings-save" onClick={saveSettings}>Save Settings</button>
        </div>
      </footer>
    </main>
  );
}
