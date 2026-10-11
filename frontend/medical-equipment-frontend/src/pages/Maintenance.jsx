import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllEquipment,
    updateEquipment
} from "../services/equipmentService";
import "../App.css";

function Maintenance() {
    const navigate = useNavigate();

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const loadEquipment = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllEquipment();

            setEquipment(data);
        } catch (err) {
            console.error("Error loading equipment:", err);
            setError("Unable to load equipment data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEquipment();
    }, []);

    const handleMarkAvailable = async (item) => {
        const name =
            item.equipment_name ||
            item.equipmentName ||
            "this equipment";

        const confirmed = window.confirm(
            `Mark "${name}" as Available?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setSavingId(item.id);
            setError("");

            await updateEquipment(item.id, {
                equipmentName:
                    item.equipment_name ||
                    item.equipmentName ||
                    "",
                category: item.category || "",
                manufacturer:
                    item.manufacturer || "",
                modelNumber:
                    item.model_number ||
                    item.modelNumber ||
                    "",
                serialNumber:
                    item.serial_number ||
                    item.serialNumber ||
                    "",
                purchaseDate:
                    item.purchase_date
                        ? item.purchase_date.substring(0, 10)
                        : "",
                quantity: Number(item.quantity),
                status: "Available",
                location: item.location || ""
            });

            setEquipment((previous) =>
                previous.map((equipmentItem) =>
                    equipmentItem.id === item.id
                        ? {
                              ...equipmentItem,
                              status: "Available"
                          }
                        : equipmentItem
                )
            );
        } catch (err) {
            console.error(
                "Error updating maintenance status:",
                err
            );

            setError(
                "Unable to update equipment status. Please try again."
            );
        } finally {
            setSavingId(null);
        }
    };

    const maintenanceEquipment = useMemo(() => {
        return equipment.filter(
            (item) =>
                (item.status || "").toLowerCase() ===
                "under maintenance"
        );
    }, [equipment]);

    const categories = useMemo(() => {
        return [
            "All",
            ...new Set(
                maintenanceEquipment.map(
                    (item) => item.category
                )
            )
        ];
    }, [maintenanceEquipment]);

    const filteredEquipment = useMemo(() => {
        return maintenanceEquipment.filter((item) => {
            const name =
                item.equipment_name ||
                item.equipmentName ||
                "";

            const manufacturer =
                item.manufacturer || "";

            const model =
                item.model_number ||
                item.modelNumber ||
                "";

            const matchesSearch =
                `${name} ${manufacturer} ${model}`
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                categoryFilter === "All" ||
                item.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [
        maintenanceEquipment,
        search,
        categoryFilter
    ]);

    const totalEquipment = equipment.length;

    const maintenanceCount =
        maintenanceEquipment.length;

    const availableCount = equipment.filter(
        (item) =>
            (item.status || "").toLowerCase() ===
            "available"
    ).length;

    const inUseCount = equipment.filter(
        (item) =>
            (item.status || "").toLowerCase() ===
            "in use"
    ).length;

    return (
        <div className="form-page">
            <div className="form-page-header">
                <div>
                    <span className="page-overline">
                        EQUIPMENT MANAGEMENT
                    </span>

                    <h1>Maintenance Management</h1>

                    <p>
                        Track and monitor medical equipment
                        requiring maintenance.
                    </p>
                </div>

                <button
                    className="form-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="maintenance-stats">
                <div className="maintenance-stat-card">
                    <div className="maintenance-stat-icon">
                        🔧
                    </div>

                    <div>
                        <span>
                            Under Maintenance
                        </span>

                        <strong>
                            {maintenanceCount}
                        </strong>
                    </div>
                </div>

                <div className="maintenance-stat-card">
                    <div className="maintenance-stat-icon">
                        📦
                    </div>

                    <div>
                        <span>Total Equipment</span>

                        <strong>
                            {totalEquipment}
                        </strong>
                    </div>
                </div>

                <div className="maintenance-stat-card">
                    <div className="maintenance-stat-icon">
                        ✓
                    </div>

                    <div>
                        <span>Available</span>

                        <strong>
                            {availableCount}
                        </strong>
                    </div>
                </div>

                <div className="maintenance-stat-card">
                    <div className="maintenance-stat-icon">
                        ●
                    </div>

                    <div>
                        <span>In Use</span>

                        <strong>
                            {inUseCount}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="equipment-form-card maintenance-card">
                <div className="maintenance-toolbar">
                    <div>
                        <h2>Equipment Under Maintenance</h2>

                        <p>
                            Review equipment currently
                            unavailable for use.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={loadEquipment}
                    >
                        ↻ Refresh
                    </button>
                </div>

                <div className="maintenance-filters">
                    <div className="maintenance-search">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search equipment, manufacturer or model..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <select
                        className="maintenance-filter-select"
                        value={categoryFilter}
                        onChange={(event) =>
                            setCategoryFilter(
                                event.target.value
                            )
                        }
                    >
                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <div className="form-error">
                        <span>⚠</span>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>

                        <h3>
                            Loading maintenance data...
                        </h3>

                        <p>
                            Fetching equipment information.
                        </p>
                    </div>
                ) : filteredEquipment.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ✓
                        </div>

                        <h3>
                            No Equipment Under Maintenance
                        </h3>

                        <p>
                            All equipment is currently
                            available or in use.
                        </p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="equipment-table">
                            <thead>
                                <tr>
                                    <th>Equipment</th>
                                    <th>Category</th>
                                    <th>Manufacturer</th>
                                    <th>Model</th>
                                    <th>Quantity</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredEquipment.map(
                                    (item) => {
                                        const name =
                                            item.equipment_name ||
                                            item.equipmentName;

                                        const model =
                                            item.model_number ||
                                            item.modelNumber;

                                        const isSaving =
                                            savingId ===
                                            item.id;

                                        return (
                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >
                                                <td>
                                                    <div className="equipment-name">
                                                        <div className="equipment-mini-icon">
                                                            🔧
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {
                                                                    name
                                                                }
                                                            </strong>

                                                            <small>
                                                                Serial:{" "}
                                                                {item.serial_number ||
                                                                    item.serialNumber ||
                                                                    "N/A"}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="category-text">
                                                        {
                                                            item.category
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        item.manufacturer
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        model
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            item.quantity
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span className="location-text">
                                                        📍{" "}
                                                        {
                                                            item.location
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="status-badge maintenance">
                                                        <span className="status-dot"></span>
                                                        Under Maintenance
                                                    </span>
                                                </td>

                                                <td>
                                                    <button
                                                        className="maintenance-action-button"
                                                        onClick={() =>
                                                            handleMarkAvailable(
                                                                item
                                                            )
                                                        }
                                                        disabled={
                                                            isSaving
                                                        }
                                                    >
                                                        {isSaving
                                                            ? "Updating..."
                                                            : "Mark Available"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Maintenance;