const express = require("express");

const {
    getAllEquipment,
    getEquipmentById,
    addEquipment,
    updateEquipment,
    deleteEquipment
} = require("../controllers/equipmentController");

const router = express.Router();

// GET all equipment
router.get("/", getAllEquipment);

// GET equipment by ID
router.get("/:id", getEquipmentById);

// POST - Add new equipment
router.post("/", addEquipment);

// PUT - Update equipment
router.put("/:id", updateEquipment);

// DELETE - Delete equipment
router.delete("/:id", deleteEquipment);

module.exports = router;