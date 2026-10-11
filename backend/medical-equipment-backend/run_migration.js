// One-time migration script — run with: node run_migration.js
const db = require("./db");
const bcrypt = require("bcryptjs");

async function migrate() {
    console.log("Running MediTrack Pro database migration...\n");

    // Create users table
    await new Promise((resolve, reject) => {
        db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(80) NOT NULL UNIQUE,
                email VARCHAR(180) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(150) NOT NULL DEFAULT '',
                role ENUM('admin','technician','viewer') NOT NULL DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) { console.error("  ✗ users table:", err.message); reject(err); }
            else { console.log("  ✓ users table created/verified"); resolve(); }
        });
    });

    // Create maintenance_records table
    await new Promise((resolve, reject) => {
        db.query(`
            CREATE TABLE IF NOT EXISTS maintenance_records (
                id INT AUTO_INCREMENT PRIMARY KEY,
                equipment_id BIGINT NOT NULL,
                maintenance_type ENUM('preventive','corrective','inspection','calibration') NOT NULL DEFAULT 'preventive',
                description TEXT NOT NULL,
                performed_by VARCHAR(150) NOT NULL DEFAULT '',
                maintenance_date DATE NOT NULL,
                next_due_date DATE NULL,
                cost DECIMAL(10,2) NULL DEFAULT 0.00,
                status ENUM('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'completed',
                notes TEXT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_maintenance_equipment FOREIGN KEY (equipment_id)
                    REFERENCES equipment(id) ON DELETE CASCADE
            )
        `, (err) => {
            if (err) {
                if (err.message.includes("already exists")) {
                    console.log("  ✓ maintenance_records table already exists");
                    resolve();
                } else {
                    console.error("  ✗ maintenance_records table:", err.message);
                    reject(err);
                }
            } else {
                console.log("  ✓ maintenance_records table created/verified");
                resolve();
            }
        });
    });

    // Insert default admin user
    const hash = await bcrypt.hash("admin123", 10);
    await new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO users (username, email, password_hash, full_name, role)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
            ["admin", "admin@meditrack.com", hash, "Administrator", "admin"],
            (err) => {
                if (err) { console.error("  ✗ admin user:", err.message); reject(err); }
                else { console.log("  ✓ admin user created (admin / admin123)"); resolve(); }
            }
        );
    });

    console.log("\n✓ Migration completed successfully!");
    db.end();
}

migrate().catch((err) => {
    console.error("\n✗ Migration failed:", err.message);
    db.end();
    process.exit(1);
});
