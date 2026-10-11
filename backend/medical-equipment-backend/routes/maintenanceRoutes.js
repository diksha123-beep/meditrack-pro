const express = require("express");
const {
    getAllMaintenanceRecords,
    getMaintenanceRecordById,
    getMaintenanceByEquipment,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
} = require("../controllers/maintenanceController");

const router = express.Router();

// GET all maintenance records
router.get("/", getAllMaintenanceRecords);

// GET maintenance record by ID
router.get("/:id", getMaintenanceRecordById);

// GET maintenance records for a specific equipment
router.get("/equipment/:equipmentId", getMaintenanceByEquipment);

// POST — add a new maintenance record
router.post("/", addMaintenanceRecord);

// PUT — update a maintenance record
router.put("/:id", updateMaintenanceRecord);

// DELETE — delete a maintenance record
router.delete("/:id", deleteMaintenanceRecord);

module.exports = router;
