import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEquipment } from "../services/equipmentService";
import "../App.css";

function Reports() {
    const navigate = useNavigate();

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadEquipment = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllEquipment();

            setEquipment(data);
        } catch (err) {
            console.error("Error loading reports:", err);

            setError(
                "Unable to load equipment report data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEquipment();
    }, []);

    const totalEquipment = equipment.length;

    const availableEquipment = equipment.filter(
        (item) =>
            (item.status || "").toLowerCase() ===
            "available"
    ).length;

    const inUseEquipment = equipment.filter(
        (item) =>
            (item.status || "").toLowerCase() ===
            "in use"
    ).length;

    const maintenanceEquipment = equipment.filter(
        (item) =>
            (item.status || "").toLowerCase() ===
            "under maintenance"
    ).length;

    const totalQuantity = useMemo(() => {
        return equipment.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );
    }, [equipment]);

    const categories = useMemo(() => {
        const categoryMap = {};

        equipment.forEach((item) => {
            const category =
                item.category || "Uncategorized";

            categoryMap[category] =
                (categoryMap[category] || 0) + 1;
        });

        return Object.entries(categoryMap);
    }, [equipment]);

    const getPercentage = (value) => {
        if (totalEquipment === 0) {
            return 0;
        }

        return Math.round(
            (value / totalEquipment) * 100
        );
    };

    const exportReport = () => {
        if (equipment.length === 0) {
            alert("No equipment data available to export.");
            return;
        }

        const headers = [
            "ID",
            "Equipment Name",
            "Category",
            "Manufacturer",
            "Model Number",
            "Serial Number",
            "Purchase Date",
            "Quantity",
            "Status",
            "Location"
        ];

        const rows = equipment.map((item) => [
            item.id,
            item.equipment_name ||
                item.equipmentName ||
                "",
            item.category || "",
            item.manufacturer || "",
            item.model_number ||
                item.modelNumber ||
                "",
            item.serial_number ||
                item.serialNumber ||
                "",
            item.purchase_date
                ? item.purchase_date.substring(0, 10)
                : "",
            item.quantity || 0,
            item.status || "",
            item.location || ""
        ]);

        const csvContent = [
            headers,
            ...rows
        ]
            .map((row) =>
                row
                    .map((value) => {
                        const text = String(value).replace(
                            /"/g,
                            '""'
                        );

                        return `"${text}"`;
                    })
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "medical-equipment-report.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    return (
        <div className="form-page reports-page">
            <div className="form-page-header">
                <div>
                    <span className="page-overline">
                        REPORTING
                    </span>

                    <h1>Equipment Reports</h1>

                    <p>
                        View inventory statistics and
                        equipment status information.
                    </p>
                </div>

                <button
                    className="form-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {error && (
                <div className="form-error">
                    <span>⚠</span>
                    {error}
                </div>
            )}

            {loading ? (
                <div className="equipment-form-card">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>

                        <h3>
                            Loading report data...
                        </h3>

                        <p>
                            Fetching equipment information.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="reports-stats">
                        <div className="report-stat-card">
                            <div className="report-stat-icon">
                                ▣
                            </div>

                            <div>
                                <span>
                                    Total Equipment
                                </span>

                                <strong>
                                    {totalEquipment}
                                </strong>
                            </div>
                        </div>

                        <div className="report-stat-card">
                            <div className="report-stat-icon">
                                ✓
                            </div>

                            <div>
                                <span>
                                    Available
                                </span>

                                <strong>
                                    {availableEquipment}
                                </strong>
                            </div>
                        </div>

                        <div className="report-stat-card">
                            <div className="report-stat-icon">
                                ◉
                            </div>

                            <div>
                                <span>
                                    In Use
                                </span>

                                <strong>
                                    {inUseEquipment}
                                </strong>
                            </div>
                        </div>

                        <div className="report-stat-card">
                            <div className="report-stat-icon">
                                🔧
                            </div>

                            <div>
                                <span>
                                    Under Maintenance
                                </span>

                                <strong>
                                    {maintenanceEquipment}
                                </strong>
                            </div>
                        </div>

                        <div className="report-stat-card">
                            <div className="report-stat-icon">
                                📦
                            </div>

                            <div>
                                <span>
                                    Total Quantity
                                </span>

                                <strong>
                                    {totalQuantity}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="reports-grid">
                        <div className="equipment-form-card">
                            <div className="reports-card-header">
                                <div>
                                    <h2>
                                        Equipment by Category
                                    </h2>

                                    <p>
                                        Distribution of registered
                                        equipment categories.
                                    </p>
                                </div>
                            </div>

                            {categories.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">
                                        📊
                                    </div>

                                    <h3>
                                        No Category Data
                                    </h3>

                                    <p>
                                        Equipment category
                                        information is not
                                        available.
                                    </p>
                                </div>
                            ) : (
                                <div className="category-report-list">
                                    {categories.map(
                                        ([category, count]) => (
                                            <div
                                                className="category-report-item"
                                                key={category}
                                            >
                                                <div>
                                                    <strong>
                                                        {category}
                                                    </strong>

                                                    <span>
                                                        {count}{" "}
                                                        equipment
                                                        record
                                                        {count !==
                                                        1
                                                            ? "s"
                                                            : ""}
                                                    </span>
                                                </div>

                                                <strong>
                                                    {count}
                                                </strong>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="equipment-form-card">
                            <div className="reports-card-header">
                                <div>
                                    <h2>
                                        Status Summary
                                    </h2>

                                    <p>
                                        Current equipment
                                        availability.
                                    </p>
                                </div>
                            </div>

                            <div className="status-report-list">
                                <div className="status-report-item">
                                    <div className="status-report-info">
                                        <div className="status-report-label">
                                            <span className="status-badge available">
                                                <span className="status-dot"></span>
                                                Available
                                            </span>

                                            <strong>
                                                {availableEquipment}
                                            </strong>
                                        </div>

                                        <div className="status-progress">
                                            <div
                                                className="status-progress-fill available-progress"
                                                style={{
                                                    width: `${getPercentage(
                                                        availableEquipment
                                                    )}%`
                                                }}
                                            ></div>
                                        </div>

                                        <span className="status-percentage">
                                            {getPercentage(
                                                availableEquipment
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>

                                <div className="status-report-item">
                                    <div className="status-report-info">
                                        <div className="status-report-label">
                                            <span className="status-badge in-use">
                                                <span className="status-dot"></span>
                                                In Use
                                            </span>

                                            <strong>
                                                {inUseEquipment}
                                            </strong>
                                        </div>

                                        <div className="status-progress">
                                            <div
                                                className="status-progress-fill in-use-progress"
                                                style={{
                                                    width: `${getPercentage(
                                                        inUseEquipment
                                                    )}%`
                                                }}
                                            ></div>
                                        </div>

                                        <span className="status-percentage">
                                            {getPercentage(
                                                inUseEquipment
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>

                                <div className="status-report-item">
                                    <div className="status-report-info">
                                        <div className="status-report-label">
                                            <span className="status-badge maintenance">
                                                <span className="status-dot"></span>
                                                Under Maintenance
                                            </span>

                                            <strong>
                                                {maintenanceEquipment}
                                            </strong>
                                        </div>

                                        <div className="status-progress">
                                            <div
                                                className="status-progress-fill maintenance-progress"
                                                style={{
                                                    width: `${getPercentage(
                                                        maintenanceEquipment
                                                    )}%`
                                                }}
                                            ></div>
                                        </div>

                                        <span className="status-percentage">
                                            {getPercentage(
                                                maintenanceEquipment
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="equipment-form-card reports-table-card">
                        <div className="reports-card-header">
                            <div>
                                <h2>
                                    Inventory Report
                                </h2>

                                <p>
                                    Complete equipment inventory
                                    summary.
                                </p>
                            </div>

                            <div className="report-actions">
                                <button
                                    className="export-button"
                                    onClick={exportReport}
                                >
                                    ↓ Export Report
                                </button>

                                <button
                                    className="refresh-button"
                                    onClick={loadEquipment}
                                >
                                    ↻ Refresh
                                </button>
                            </div>
                        </div>

                        {equipment.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    📦
                                </div>

                                <h3>
                                    No Equipment Records
                                </h3>

                                <p>
                                    Add equipment to generate
                                    inventory reports.
                                </p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="equipment-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Equipment</th>
                                            <th>Category</th>
                                            <th>Quantity</th>
                                            <th>Status</th>
                                            <th>Location</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {equipment.map(
                                            (item) => {
                                                const name =
                                                    item.equipment_name ||
                                                    item.equipmentName;

                                                return (
                                                    <tr
                                                        key={
                                                            item.id
                                                        }
                                                    >
                                                        <td>
                                                            #
                                                            {
                                                                item.id
                                                            }
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {
                                                                    name
                                                                }
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {
                                                                item.category
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                item.quantity
                                                            }
                                                        </td>

                                                        <td>
                                                            <span className="status-badge">
                                                                {
                                                                    item.status
                                                                }
                                                            </span>
                                                        </td>

                                                        <td>
                                                            📍{" "}
                                                            {
                                                                item.location
                                                            }
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
                </>
            )}
        </div>
    );
}

export default Reports;