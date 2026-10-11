const db = require("../db");

/**
 * GET /api/dashboard/stats
 * Returns aggregated dashboard statistics from real database data.
 */
const getDashboardStats = (req, res) => {
    const queries = {
        total: "SELECT COUNT(*) AS count FROM equipment",
        available: "SELECT COUNT(*) AS count FROM equipment WHERE LOWER(status) = 'available'",
        inUse: "SELECT COUNT(*) AS count FROM equipment WHERE LOWER(status) = 'in use'",
        maintenance: "SELECT COUNT(*) AS count FROM equipment WHERE LOWER(status) = 'under maintenance'",
        totalQuantity: "SELECT COALESCE(SUM(quantity), 0) AS total FROM equipment",
        lowStock: "SELECT COUNT(*) AS count FROM equipment WHERE quantity <= 2",
        lowStockItems: "SELECT id, equipment_name, quantity, category, location FROM equipment WHERE quantity <= 2 ORDER BY quantity ASC LIMIT 10",
        categories: "SELECT category, COUNT(*) AS count FROM equipment GROUP BY category ORDER BY count DESC",
        recentEquipment: "SELECT id, equipment_name, category, status, created_at FROM equipment ORDER BY created_at DESC LIMIT 5",
        recentMaintenance: `
            SELECT mr.id, mr.maintenance_type, mr.description, mr.maintenance_date, mr.status,
                   e.equipment_name
            FROM maintenance_records mr
            LEFT JOIN equipment e ON mr.equipment_id = e.id
            ORDER BY mr.created_at DESC LIMIT 5
        `,
        upcomingMaintenance: `
            SELECT mr.id, mr.next_due_date, mr.maintenance_type,
                   e.equipment_name, e.id AS equipment_id
            FROM maintenance_records mr
            LEFT JOIN equipment e ON mr.equipment_id = e.id
            WHERE mr.next_due_date IS NOT NULL AND mr.next_due_date >= CURDATE()
            ORDER BY mr.next_due_date ASC LIMIT 5
        `,
        overdueMaintenance: `
            SELECT mr.id, mr.next_due_date, mr.maintenance_type,
                   e.equipment_name, e.id AS equipment_id
            FROM maintenance_records mr
            LEFT JOIN equipment e ON mr.equipment_id = e.id
            WHERE mr.next_due_date IS NOT NULL AND mr.next_due_date < CURDATE()
              AND mr.status != 'completed' AND mr.status != 'cancelled'
            ORDER BY mr.next_due_date ASC LIMIT 10
        `,
        recentNotifications: "SELECT id, title, message, type, is_read, created_at FROM notifications ORDER BY created_at DESC LIMIT 5",
    };

    const results = {};
    const keys = Object.keys(queries);
    let completed = 0;
    let hasError = false;

    keys.forEach((key) => {
        db.query(queries[key], (err, rows) => {
            if (hasError) return;

            if (err) {
                // Don't fail the whole response for optional queries
                console.error(`Dashboard stat '${key}' query error:`, err.message);
                results[key] = key.includes("count") || key === "totalQuantity" ? 0 : [];
            } else {
                if (key === "total" || key === "available" || key === "inUse" || key === "maintenance" || key === "lowStock") {
                    results[key] = rows[0]?.count || 0;
                } else if (key === "totalQuantity") {
                    results[key] = rows[0]?.total || 0;
                } else {
                    results[key] = rows;
                }
            }

            completed++;
            if (completed === keys.length) {
                res.json(results);
            }
        });
    });
};

module.exports = { getDashboardStats };
