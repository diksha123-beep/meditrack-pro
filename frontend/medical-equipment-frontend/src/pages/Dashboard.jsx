import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEquipment, deleteEquipment } from "../services/equipmentService";
import { useAuth } from "../context/AuthContext";
import MediTrackLogo from "../components/MediTrackLogo";
import "../App.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const [dashStats, setDashStats] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [activePage, setActivePage] = useState("dashboard");

  function authHeaders() {
    const token = localStorage.getItem("meditrack_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  const loadEquipment = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllEquipment();
      setEquipment(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading equipment:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        return;
      }
      setError("Unable to connect to the equipment database.");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/dashboard/stats", {
        headers: authHeaders(),
      });
      if (response.status === 401 || response.status === 403) { logout(); return; }
      if (!response.ok) return;
      const data = await response.json();
      setDashStats(data);
    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error("Unable to load notifications");
      const data = await response.json();
      const items = Array.isArray(data) ? data : data.notifications || [];
      setNotifications(items);
      setUnreadCount(
        typeof data.unreadCount === "number"
          ? data.unreadCount
          : items.filter((item) => !item.is_read && item.is_read !== 1).length
      );
      setNotificationError("");
    } catch (err) {
      console.error("Error loading notifications:", err);
      setNotificationError("Unable to load notifications.");
    }
  };

  const markNotificationRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        { method: "PATCH", headers: authHeaders() }
      );
      if (!response.ok) throw new Error("Unable to update notification");
      await loadNotifications();
    } catch (err) {
      console.error(err);
      setNotificationError("Could not mark this notification as read.");
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        { method: "PATCH", headers: authHeaders() }
      );
      if (!response.ok) throw new Error("Unable to update notifications");
      await loadNotifications();
    } catch (err) {
      console.error(err);
      setNotificationError("Could not mark notifications as read.");
    }
  };

  useEffect(() => {
    loadEquipment();
    loadNotifications();
    loadDashboardStats();
  }, []);

  const handleDelete = async (id, equipmentName) => {
    if (!window.confirm(`Are you sure you want to delete "${equipmentName}"?`)) {
      return;
    }
    try {
      await deleteEquipment(id);
      setEquipment((previous) =>
        previous.filter((item) => String(item.id) !== String(id))
      );
      setSuccessMsg(`"${equipmentName}" was deleted successfully.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadDashboardStats();
    } catch (err) {
      console.error("Error deleting equipment:", err);
      setError("Unable to delete equipment. Please try again.");
    }
  };

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const name = item.equipment_name || item.equipmentName || "";
      const searchableText = [
        name,
        item.category,
        item.manufacturer,
        item.location,
      ].join(" ").toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        (item.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [equipment, searchTerm, statusFilter]);

  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter(
    (item) => (item.status || "").toLowerCase() === "available"
  ).length;
  const inUseEquipment = equipment.filter(
    (item) => (item.status || "").toLowerCase() === "in use"
  ).length;
  const maintenanceEquipment = equipment.filter(
    (item) => (item.status || "").toLowerCase() === "under maintenance"
  ).length;
  const lowStockCount = dashStats?.lowStock || equipment.filter(i => (i.quantity || 0) <= 2).length;

  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "available":
        return "status-badge available";
      case "in use":
        return "status-badge in-use";
      case "under maintenance":
        return "status-badge maintenance";
      default:
        return "status-badge";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleNavClick = (page, path) => {
    setActivePage(page);
    if (path.startsWith("#")) {
      document.getElementById(path.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
    }
  };

  const displayName = user?.fullName || user?.username || "Administrator";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon" style={{ background: "rgba(20,184,166,0.15)", boxShadow: "0 4px 12px rgba(20,184,166,.12)" }}>
            <MediTrackLogo size={32} />
          </div>
          <div>
            <h2>MediTrack Pro</h2>
            <span>Equipment Management</span>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">MAIN MENU</p>
          <button className={`nav-item ${activePage === "dashboard" ? "active" : ""}`} onClick={() => handleNavClick("dashboard", "/")}>
            <span>▦</span> Dashboard
          </button>
          <button className={`nav-item ${activePage === "equipment" ? "active" : ""}`} onClick={() => handleNavClick("equipment", "#equipment-section")}>
            <span>▣</span> Equipment
          </button>
          <button className={`nav-item ${activePage === "maintenance" ? "active" : ""}`} onClick={() => handleNavClick("maintenance", "/maintenance")}>
            <span>🔧</span> Maintenance
          </button>
          <button className={`nav-item ${activePage === "reports" ? "active" : ""}`} onClick={() => handleNavClick("reports", "/reports")}>
            <span>▤</span> Reports
          </button>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">SYSTEM</p>
          <button className="nav-item" onClick={() => navigate("/settings")}>
            <span>⚙</span> Settings
          </button>
          <button className="nav-item" onClick={() => navigate("/help")}>
            <span>?</span> Help &amp; Support
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">{displayInitial}</div>
            <div>
              <strong>{displayName}</strong>
              <small>{user?.role || "Admin"}</small>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="mobile-brand">
            <MediTrackLogo size={24} /> MediTrack Pro
          </div>

          <div className="header-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="header-actions" style={{ position: "relative" }}>
            <button
              type="button"
              className="icon-button"
              onClick={() => {
                setNotificationsOpen((previous) => !previous);
                loadNotifications();
              }}
              aria-label="Open notifications"
              aria-expanded={notificationsOpen}
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-dot">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,
                  width: "min(360px, calc(100vw - 32px))",
                  maxHeight: 420,
                  overflowY: "auto",
                  background: "#fff",
                  color: "#1f2937",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  boxShadow: "0 12px 32px rgba(15,23,42,.16)",
                  zIndex: 1000,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <strong>Notifications</strong>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    disabled={unreadCount === 0}
                    style={{
                      border: 0,
                      background: "transparent",
                      color: unreadCount === 0 ? "#9ca3af" : "#14b8a6",
                      cursor: unreadCount === 0 ? "default" : "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Mark all as read
                  </button>
                </div>

                {notificationError && (
                  <p role="alert" style={{ color: "#b42318", fontSize: 13 }}>
                    {notificationError}
                  </p>
                )}

                {notifications.length === 0 ? (
                  <p style={{ color: "#6b7280", fontSize: 13, textAlign: "center", padding: 18 }}>
                    No notifications yet.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {notifications.map((notification) => {
                      const isRead =
                        notification.is_read === true ||
                        notification.is_read === 1;

                      return (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() =>
                            !isRead && markNotificationRead(notification.id)
                          }
                          style={{
                            textAlign: "left",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            padding: 10,
                            background: isRead ? "#fff" : "#f0fdfa",
                            cursor: isRead ? "default" : "pointer",
                            color: "#1f2937",
                          }}
                        >
                          <strong style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                            {notification.title || "Inventory notification"}
                            {!isRead && <span style={{ color: "#14b8a6" }}> • New</span>}
                          </strong>
                          <span style={{ display: "block", color: "#4b5563", fontSize: 12, lineHeight: 1.45 }}>
                            {notification.message || "No additional details."}
                          </span>
                          {notification.created_at && (
                            <small style={{ display: "block", color: "#9ca3af", marginTop: 6 }}>
                              {new Date(notification.created_at).toLocaleString()}
                            </small>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="header-user">
              <div className="header-avatar">{displayInitial}</div>
              <div className="header-user-info">
                <strong>{displayName}</strong>
                <span>{user?.role || "Admin"}</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="page-heading">
            <div>
              <span className="page-overline">OVERVIEW</span>
              <h1>Medical Equipment Dashboard</h1>
              <p>Monitor and manage your medical equipment inventory in real time.</p>
            </div>
            <button className="primary-button" onClick={() => navigate("/add-equipment")}>
              <span>＋</span> Add Equipment
            </button>
          </div>

          {successMsg && (
            <div className="form-success" style={{ marginBottom: 16 }}>
              <span>✓</span> {successMsg}
            </div>
          )}

          {error && (
            <div className="error-banner">
              <span>⚠</span>
              <div>
                <strong>Database connection issue</strong>
                <p>{error}</p>
              </div>
              <button onClick={loadEquipment}>Retry</button>
            </div>
          )}

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon blue">▣</div>
                <span className="stat-trend">Inventory</span>
              </div>
              <div><p>Total Equipment</p><h2>{loading ? "—" : totalEquipment}</h2></div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon green">✓</div>
                <span className="stat-trend green-text">Ready</span>
              </div>
              <div><p>Available</p><h2>{loading ? "—" : availableEquipment}</h2></div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon purple">◉</div>
                <span className="stat-trend purple-text">Active</span>
              </div>
              <div><p>Currently In Use</p><h2>{loading ? "—" : inUseEquipment}</h2></div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon orange">🔧</div>
                <span className="stat-trend orange-text">Attention</span>
              </div>
              <div><p>Under Maintenance</p><h2>{loading ? "—" : maintenanceEquipment}</h2></div>
            </div>
          </section>

          {/* Low-stock alerts */}
          {!loading && dashStats?.lowStockItems?.length > 0 && (
            <section className="low-stock-alert">
              <div className="low-stock-header">
                <span>⚠️</span>
                <div>
                  <strong>Low Stock Alert — {lowStockCount} item{lowStockCount !== 1 ? "s" : ""}</strong>
                  <p>The following equipment has quantity ≤ 2 and may need restocking.</p>
                </div>
              </div>
              <div className="low-stock-items">
                {dashStats.lowStockItems.map((item) => (
                  <div className="low-stock-item" key={item.id}>
                    <strong>{item.equipment_name}</strong>
                    <span className="low-stock-qty">Qty: {item.quantity}</span>
                    <span className="low-stock-loc">📍 {item.location || "N/A"}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent activity cards */}
          {!loading && dashStats && (
            <section className="activity-grid">
              {/* Recent equipment */}
              <div className="activity-card">
                <h3>📦 Recently Added Equipment</h3>
                {dashStats.recentEquipment?.length > 0 ? (
                  <div className="activity-list">
                    {dashStats.recentEquipment.map((item) => (
                      <div className="activity-item" key={item.id} onClick={() => navigate(`/equipment/${item.id}`)} style={{ cursor: "pointer" }}>
                        <div>
                          <strong>{item.equipment_name}</strong>
                          <small>{item.category}</small>
                        </div>
                        <span className={getStatusClass(item.status)}><span>●</span> {item.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="activity-empty">No recent equipment added.</p>
                )}
              </div>

              {/* Upcoming maintenance */}
              <div className="activity-card">
                <h3>📅 Upcoming Maintenance</h3>
                {dashStats.upcomingMaintenance?.length > 0 ? (
                  <div className="activity-list">
                    {dashStats.upcomingMaintenance.map((item) => (
                      <div className="activity-item" key={item.id}>
                        <div>
                          <strong>{item.equipment_name || "Equipment"}</strong>
                          <small>{item.maintenance_type} — Due: {item.next_due_date?.substring(0, 10)}</small>
                        </div>
                        <span className="status-badge maintenance"><span>●</span> Scheduled</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="activity-empty">No upcoming maintenance scheduled.</p>
                )}
              </div>
            </section>
          )}

          <section className="inventory-card" id="equipment-section">
            <div className="inventory-header">
              <div>
                <h2>Equipment Inventory</h2>
                <p>View and manage all registered medical equipment.</p>
              </div>
              <button className="outline-button" onClick={() => { loadEquipment(); loadDashboardStats(); }}>↻ Refresh</button>
            </div>

            <div className="filter-bar">
              <div className="table-search">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="Search by equipment, category or location..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner" />
                <h3>Loading equipment...</h3>
                <p>Fetching inventory data from the database.</p>
              </div>
            ) : filteredEquipment.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No equipment found</h3>
                <p>
                  {equipment.length === 0
                    ? "Your equipment inventory is currently empty."
                    : "Try changing your search or filter."}
                </p>
                {equipment.length === 0 && (
                  <button className="primary-button" onClick={() => navigate("/add-equipment")}>
                    ＋ Add First Equipment
                  </button>
                )}
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="equipment-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Equipment</th>
                      <th>Category</th>
                      <th>Manufacturer</th>
                      <th>Model</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEquipment.map((item) => {
                      const name = item.equipment_name || item.equipmentName || "Unnamed equipment";
                      const model = item.model_number || item.modelNumber || "N/A";

                      return (
                        <tr key={item.id}>
                          <td><span className="equipment-id">#{item.id}</span></td>
                          <td>
                            <div className="equipment-name">
                              <div className="equipment-mini-icon">🏥</div>
                              <div>
                                <strong>{name}</strong>
                                <small>Serial: {item.serial_number || item.serialNumber || "N/A"}</small>
                              </div>
                            </div>
                          </td>
                          <td><span className="category-text">{item.category || "—"}</span></td>
                          <td>{item.manufacturer || "—"}</td>
                          <td>{model}</td>
                          <td>
                            <strong style={{ color: (item.quantity || 0) <= 2 ? "#dc2626" : "inherit" }}>
                              {item.quantity ?? 0}
                              {(item.quantity || 0) <= 2 && <span title="Low stock"> ⚠</span>}
                            </strong>
                          </td>
                          <td>
                            <span className={getStatusClass(item.status)}>
                              <span>●</span> {item.status || "Unknown"}
                            </span>
                          </td>
                          <td><span className="location-text">📍 {item.location || "—"}</span></td>
                          <td>
                            <div className="action-buttons">
                              <button className="view-button" onClick={() => navigate(`/equipment/${item.id}`)}>
                                View
                              </button>
                              <button className="edit-button" onClick={() => navigate(`/edit-equipment/${item.id}`)}>
                                ✎ Edit
                              </button>
                              <button className="delete-button" onClick={() => handleDelete(item.id, name)}>
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && filteredEquipment.length > 0 && (
              <div className="table-footer">
                <span>
                  Showing <strong>{filteredEquipment.length}</strong> of{" "}
                  <strong>{equipment.length}</strong> equipment records
                </span>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
