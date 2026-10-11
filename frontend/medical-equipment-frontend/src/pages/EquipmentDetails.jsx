import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEquipmentById } from "../services/equipmentService";
import "../App.css";

function EquipmentDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadEquipment = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getEquipmentById(id);

                setEquipment(data);
            } catch (err) {
                console.error(
                    "Error loading equipment:",
                    err
                );

                setError(
                    "Unable to load equipment details."
                );
            } finally {
                setLoading(false);
            }
        };

        loadEquipment();
    }, [id]);

    if (loading) {
        return (
            <div className="form-page">
                <div className="loading-state">
                    <div className="loading-spinner"></div>

                    <h3>
                        Loading equipment details...
                    </h3>

                    <p>
                        Fetching equipment information.
                    </p>
                </div>
            </div>
        );
    }

    if (error || !equipment) {
        return (
            <div className="form-page">
                <div className="equipment-form-card">
                    <div className="empty-state">
                        <div className="empty-icon">
                            ⚠
                        </div>

                        <h3>
                            Equipment Not Found
                        </h3>

                        <p>
                            {error ||
                                "The requested equipment could not be found."}
                        </p>

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const equipmentName =
        equipment.equipment_name ||
        equipment.equipmentName ||
        "Medical Equipment";

    const modelNumber =
        equipment.model_number ||
        equipment.modelNumber ||
        "N/A";

    const serialNumber =
        equipment.serial_number ||
        equipment.serialNumber ||
        "N/A";

    const purchaseDate = equipment.purchase_date
        ? equipment.purchase_date.substring(0, 10)
        : "N/A";

    const statusClass =
        (equipment.status || "").toLowerCase() ===
        "available"
            ? "status-badge available"
            : (equipment.status || "").toLowerCase() ===
              "in use"
            ? "status-badge in-use"
            : (equipment.status || "").toLowerCase() ===
              "under maintenance"
            ? "status-badge maintenance"
            : "status-badge";

    return (
        <div className="form-page">
            <div className="form-page-header">
                <div>
                    <span className="page-overline">
                        EQUIPMENT MANAGEMENT
                    </span>

                    <h1>Equipment Details</h1>

                    <p>
                        View complete information about
                        this medical equipment.
                    </p>
                </div>

                <button
                    className="form-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="equipment-details-card">
                <div className="equipment-details-header">
                    <div className="equipment-details-icon">
                        🏥
                    </div>

                    <div className="equipment-details-title">
                        <h2>{equipmentName}</h2>

                        <p>
                            {equipment.category ||
                                "Medical Equipment"}
                        </p>
                    </div>

                    <div className="equipment-details-status">
                        <span className={statusClass}>
                            <span className="status-dot"></span>

                            {equipment.status ||
                                "Unknown"}
                        </span>
                    </div>
                </div>

                <div className="equipment-details-body">
                    <div className="details-section">
                        <h3>Basic Information</h3>

                        <div className="details-grid">
                            <div className="detail-item">
                                <span>
                                    Equipment Name
                                </span>

                                <strong>
                                    {equipmentName}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Category
                                </span>

                                <strong>
                                    {equipment.category ||
                                        "N/A"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Manufacturer
                                </span>

                                <strong>
                                    {equipment.manufacturer ||
                                        "N/A"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Model Number
                                </span>

                                <strong>
                                    {modelNumber}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="details-divider"></div>

                    <div className="details-section">
                        <h3>Equipment Information</h3>

                        <div className="details-grid">
                            <div className="detail-item">
                                <span>
                                    Serial Number
                                </span>

                                <strong>
                                    {serialNumber}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Purchase Date
                                </span>

                                <strong>
                                    {purchaseDate}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Quantity
                                </span>

                                <strong>
                                    {equipment.quantity}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Location
                                </span>

                                <strong>
                                    📍{" "}
                                    {equipment.location ||
                                        "N/A"}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="equipment-details-actions">
                    <button
                        className="cancel-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Back
                    </button>

                    <button
                        className="save-button"
                        onClick={() =>
                            navigate(
                                `/edit-equipment/${equipment.id}`
                            )
                        }
                    >
                        Edit Equipment
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EquipmentDetails;