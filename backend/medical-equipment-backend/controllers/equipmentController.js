const db = require("../db");

function notify(equipmentId, title, message, type) {
    // Notification failures are logged separately so a successful equipment operation remains successful.
    db.query(
        "INSERT INTO notifications (equipment_id, title, message, type) VALUES (?, ?, ?, ?)",
        [equipmentId ?? null, title, message, type],
        (err) => { if (err) console.error("Notification insert failed:", err.message); }
    );
}

const getAllEquipment = (req, res) => {
    db.query("SELECT * FROM equipment ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching equipment" });
        res.status(200).json(results);
    });
};

const getEquipmentById = (req, res) => {
    db.query("SELECT * FROM equipment WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching equipment" });
        if (!results.length) return res.status(404).json({ message: "Equipment not found" });
        res.status(200).json(results[0]);
    });
};

const addEquipment = (req, res) => {
    const { equipmentName, category, manufacturer, modelNumber, serialNumber, purchaseDate, quantity, status, location } = req.body;
    if (!equipmentName || !category || quantity === undefined || quantity === "") {
        return res.status(400).json({ message: "Equipment name, category and quantity are required" });
    }
    const sql = `INSERT INTO equipment (equipment_name, category, manufacturer, model_number, serial_number, purchase_date, quantity, status, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [equipmentName, category, manufacturer || "", modelNumber || "", serialNumber || "", purchaseDate || null, Number(quantity), status || "Available", location || ""], (err, result) => {
        if (err) { console.error("Error adding equipment:", err); return res.status(500).json({ message: "Error adding equipment", detail: err.message }); }
        notify(result.insertId, "Equipment added", `${equipmentName} was added to inventory.`, "equipment_added");
        if ((status || "Available").toLowerCase() === "under maintenance") notify(result.insertId, "Equipment under maintenance", `${equipmentName} is marked under maintenance.`, "maintenance");
        else if ((status || "Available").toLowerCase() === "in use") notify(result.insertId, "Equipment in use", `${equipmentName} is now marked in use.`, "status_change");
        res.status(201).json({ message: "Equipment added successfully", id: result.insertId });
    });
};

const updateEquipment = (req, res) => {
    const { id } = req.params;
    const { equipmentName, category, manufacturer, modelNumber, serialNumber, purchaseDate, quantity, status, location } = req.body;
    db.query("SELECT equipment_name, status FROM equipment WHERE id = ?", [id], (selectErr, rows) => {
        if (selectErr) return res.status(500).json({ message: "Error reading equipment", detail: selectErr.message });
        if (!rows.length) return res.status(404).json({ message: "Equipment not found" });
        const oldName = rows[0].equipment_name;
        const oldStatus = (rows[0].status || "").toLowerCase();
        const finalName = equipmentName || oldName;
        const sql = `UPDATE equipment SET equipment_name = ?, category = ?, manufacturer = ?, model_number = ?, serial_number = ?, purchase_date = ?, quantity = ?, status = ?, location = ? WHERE id = ?`;
        db.query(sql, [finalName, category, manufacturer || "", modelNumber || "", serialNumber || "", purchaseDate || null, Number(quantity), status || "Available", location || "", id], (err, result) => {
            if (err) { console.error("Error updating equipment:", err); return res.status(500).json({ message: "Error updating equipment", detail: err.message }); }
            const newStatus = (status || "Available").toLowerCase();
            if (newStatus !== oldStatus) {
                const readable = status || "Available";
                const type = newStatus === "under maintenance" ? "maintenance" : "status_change";
                notify(Number(id), `Equipment status: ${readable}`, `${finalName} status changed from ${rows[0].status || "Unknown"} to ${readable}.`, type);
            } else {
                notify(Number(id), "Equipment updated", `${finalName} details were updated.`, "equipment_updated");
            }
            res.status(200).json({ message: "Equipment updated successfully" });
        });
    });
};

const deleteEquipment = (req, res) => {
    const { id } = req.params;
    db.query("SELECT equipment_name FROM equipment WHERE id = ?", [id], (selectErr, rows) => {
        if (selectErr) return res.status(500).json({ message: "Error reading equipment", detail: selectErr.message });
        if (!rows.length) return res.status(404).json({ message: "Equipment not found" });
        const name = rows[0].equipment_name;
        db.query("DELETE FROM equipment WHERE id = ?", [id], (err, result) => {
            if (err) { console.error("Error deleting equipment:", err); return res.status(500).json({ message: "Error deleting equipment", detail: err.message }); }
            // ON DELETE SET NULL preserves history; equipment_id must be nullable (migration.sql).
            notify(null, "Equipment deleted", `${name} was removed from inventory.`, "equipment_deleted");
            res.status(200).json({ message: "Equipment deleted successfully" });
        });
    });
};

module.exports = { getAllEquipment, getEquipmentById, addEquipment, updateEquipment, deleteEquipment };
