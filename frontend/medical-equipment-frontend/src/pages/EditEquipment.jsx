import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getEquipmentById,
    updateEquipment
} from "../services/equipmentService";

function EditEquipment() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        equipmentName: "",
        category: "",
        manufacturer: "",
        modelNumber: "",
        serialNumber: "",
        purchaseDate: "",
        quantity: "",
        status: "Available",
        location: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadEquipment = async () => {
            try {
                const data = await getEquipmentById(id);

                setFormData({
                    equipmentName:
                        data.equipment_name || "",
                    category: data.category || "",
                    manufacturer:
                        data.manufacturer || "",
                    modelNumber:
                        data.model_number || "",
                    serialNumber:
                        data.serial_number || "",
                    purchaseDate:
                        data.purchase_date
                            ? data.purchase_date.substring(0, 10)
                            : "",
                    quantity: data.quantity || "",
                    status: data.status || "Available",
                    location: data.location || ""
                });
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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {
            await updateEquipment(id, {
                ...formData,
                quantity: Number(formData.quantity)
            });

            setMessage(
                "Equipment updated successfully."
            );

            setTimeout(() => {
                navigate("/");
            }, 900);
        } catch (err) {
            console.error(
                "Error updating equipment:",
                err
            );

            setError(
                "Unable to update equipment. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

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

    return (
        <div className="form-page">
            <div className="form-page-header">
                <div>
                    <span className="page-overline">
                        EQUIPMENT MANAGEMENT
                    </span>

                    <h1>Edit Medical Equipment</h1>

                    <p>
                        Update the details of the selected
                        medical equipment.
                    </p>
                </div>

                <button
                    className="form-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="equipment-form-card">
                <div className="form-card-header">
                    <div className="form-header-icon">
                        ✎
                    </div>

                    <div>
                        <h2>
                            Equipment Information
                        </h2>

                        <p>
                            Modify the equipment details below.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Basic Information</h3>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>
                                    Equipment Name
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="equipmentName"
                                    value={
                                        formData.equipmentName
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>
                                    Category
                                    <span>*</span>
                                </label>

                                <select
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select category
                                    </option>

                                    <option value="Diagnostic">
                                        Diagnostic
                                    </option>

                                    <option value="Monitoring">
                                        Monitoring
                                    </option>

                                    <option value="Life Support">
                                        Life Support
                                    </option>

                                    <option value="Surgical">
                                        Surgical
                                    </option>

                                    <option value="Laboratory">
                                        Laboratory
                                    </option>

                                    <option value="Therapeutic">
                                        Therapeutic
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>
                                    Manufacturer
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="manufacturer"
                                    value={
                                        formData.manufacturer
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>
                                    Model Number
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="modelNumber"
                                    value={
                                        formData.modelNumber
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-divider"></div>

                    <div className="form-section">
                        <h3>Equipment Details</h3>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>
                                    Serial Number
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="serialNumber"
                                    value={
                                        formData.serialNumber
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>
                                    Purchase Date
                                    <span>*</span>
                                </label>

                                <input
                                    type="date"
                                    name="purchaseDate"
                                    value={
                                        formData.purchaseDate
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>
                                    Quantity
                                    <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    value={
                                        formData.quantity
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>
                                    Status
                                    <span>*</span>
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Available">
                                        Available
                                    </option>

                                    <option value="In Use">
                                        In Use
                                    </option>

                                    <option value="Under Maintenance">
                                        Under Maintenance
                                    </option>
                                </select>
                            </div>

                            <div className="form-field full-width">
                                <label>
                                    Location
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={
                                        formData.location
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className="form-success">
                            <span>✓</span>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="form-error">
                            <span>⚠</span>
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Updating..."
                                : "Update Equipment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditEquipment;