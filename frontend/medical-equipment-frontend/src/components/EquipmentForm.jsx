import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addEquipment } from "../services/equipmentService";

function EquipmentForm() {
    const navigate = useNavigate();

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

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

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
            await addEquipment({
                ...formData,
                quantity: Number(formData.quantity)
            });

            setMessage("Equipment added successfully.");

            setTimeout(() => {
                navigate("/");
            }, 900);
        } catch (err) {
            console.error("Error adding equipment:", err);
            setError(
                "Unable to add equipment. Please check the details and try again."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="form-page">

            <div className="form-page-header">
                <div>
                    <span className="page-overline">
                        EQUIPMENT MANAGEMENT
                    </span>

                    <h1>Add Medical Equipment</h1>

                    <p>
                        Register new medical equipment in the inventory.
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
                        +
                    </div>

                    <div>
                        <h2>Equipment Information</h2>

                        <p>
                            Enter the details of the medical equipment
                            below.
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
                                    placeholder="e.g. ECG Machine"
                                    value={formData.equipmentName}
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
                                    value={formData.category}
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
                                    placeholder="e.g. Philips"
                                    value={formData.manufacturer}
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
                                    placeholder="e.g. TC20"
                                    value={formData.modelNumber}
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
                                    placeholder="e.g. ECG-001"
                                    value={formData.serialNumber}
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
                                    value={formData.purchaseDate}
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
                                    placeholder="Enter quantity"
                                    value={formData.quantity}
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
                                    placeholder="e.g. ICU, Emergency Department, Laboratory"
                                    value={formData.location}
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
                                ? "Saving..."
                                : "Save Equipment"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EquipmentForm;