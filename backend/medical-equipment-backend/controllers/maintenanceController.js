const db = require("../db");

/**
 * GET /api/maintenance
 * Returns all maintenance records joined with equipment names.
 */
const getAllMaintenanceRecords = (req, res) => {
    const sql = `
        SELECT mr.*, e.equipment_name, e.category, e.serial_number, e.location
        FROM maintenance_records mr
        LEFT JOIN equipment e ON mr.equipment_id = e.id
        ORDER BY mr.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching maintenance records:", err.message);
            return res.status(500).json({ message: "Error fetching maintenance records" });
        }
        res.json(results);
    });
};

/**
 * GET /api/maintenance/:id
 * Returns a single maintenance record by ID.
 */
const getMaintenanceRecordById = (req, res) => {
    const sql = `
        SELECT mr.*, e.equipment_name, e.category, e.serial_number, e.location
        FROM maintenance_records mr
        LEFT JOIN equipment e ON mr.equipment_id = e.id
        WHERE mr.id = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching maintenance record" });
        if (!results.length) return res.status(404).json({ message: "Maintenance record not found" });
        res.json(results[0]);
    });
};

/**
 * GET /api/maintenance/equipment/:equipmentId
 * Returns all maintenance records for a specific equipment.
 */
const getMaintenanceByEquipment = (req, res) => {
    const sql = `
        SELECT mr.*, e.equipment_name
        FROM maintenance_records mr
        LEFT JOIN equipment e ON mr.equipment_id = e.id
        WHERE mr.equipment_id = ?
        ORDER BY mr.maintenance_date DESC
    `;
    db.query(sql, [req.params.equipmentId], (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching maintenance history" });
        res.json(results);
    });
};

/**
 * POST /api/maintenance
 * Creates a new maintenance record.
 */
const addMaintenanceRecord = (req, res) => {
    const {
        equipment_id,
        maintenance_type,
        description,
        performed_by,
        maintenance_date,
        next_due_date,
        cost,
        status,
        notes,
    } = req.body;

    if (!equipment_id || !description || !maintenance_date) {
        return res.status(400).json({
            message: "Equipment ID, description, and maintenance date are required.",
        });
    }

    const sql = `
        INSERT INTO maintenance_records
        (equipment_id, maintenance_type, description, performed_by, maintenance_date, next_due_date, cost, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            equipment_id,
            maintenance_type || "preventive",
            description,
            performed_by || "",
            maintenance_date,
            next_due_date || null,
            cost || 0,
            status || "completed",
            notes || null,
        ],
        (err, result) => {
            if (err) {
                console.error("Error adding maintenance record:", err.message);
                return res.status(500).json({ message: "Error adding maintenance record", detail: err.message });
            }
            res.status(201).json({ message: "Maintenance record added successfully", id: result.insertId });
        }
    );
};

/**
 * PUT /api/maintenance/:id
 * Updates an existing maintenance record.
 */
const updateMaintenanceRecord = (req, res) => {
    const { id } = req.params;
    const {
        equipment_id,
        maintenance_type,
        description,
        performed_by,
        maintenance_date,
        next_due_date,
        cost,
        status,
        notes,
    } = req.body;

    const sql = `
        UPDATE maintenance_records SET
        equipment_id = ?, maintenance_type = ?, description = ?, performed_by = ?,
        maintenance_date = ?, next_due_date = ?, cost = ?, status = ?, notes = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            equipment_id,
            maintenance_type || "preventive",
            description,
            performed_by || "",
            maintenance_date,
            next_due_date || null,
            cost || 0,
            status || "completed",
            notes || null,
            id,
        ],
        (err) => {
            if (err) {
                console.error("Error updating maintenance record:", err.message);
                return res.status(500).json({ message: "Error updating maintenance record" });
            }
            res.json({ message: "Maintenance record updated successfully" });
        }
    );
};

/**
 * DELETE /api/maintenance/:id
 * Deletes a maintenance record.
 */
const deleteMaintenanceRecord = (req, res) => {
    db.query("DELETE FROM maintenance_records WHERE id = ?", [req.params.id], (err) => {
        if (err) {
            console.error("Error deleting maintenance record:", err.message);
            return res.status(500).json({ message: "Error deleting maintenance record" });
        }
        res.json({ message: "Maintenance record deleted successfully" });
    });
};

module.exports = {
    getAllMaintenanceRecords,
    getMaintenanceRecordById,
    getMaintenanceByEquipment,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
};
