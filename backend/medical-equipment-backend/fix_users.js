// Fix existing users table to add missing columns
const db = require("./db");
const bcrypt = require("bcryptjs");

async function fix() {
    const alterQueries = [
        "ALTER TABLE users ADD COLUMN email VARCHAR(180) DEFAULT ''",
        "ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) DEFAULT ''",
        "ALTER TABLE users ADD COLUMN full_name VARCHAR(150) DEFAULT ''",
    ];

    for (const q of alterQueries) {
        await new Promise((resolve) => {
            db.query(q, (err) => {
                if (err && err.message.includes("Duplicate column")) {
                    console.log("  (column already exists, skipping)");
                } else if (err) {
                    console.log("  alter:", err.message);
                } else {
                    console.log("  ✓ column added");
                }
                resolve();
            });
        });
    }

    // Hash password and update admin user
    const hash = await bcrypt.hash("admin123", 10);
    await new Promise((resolve, reject) => {
        db.query(
            "UPDATE users SET password_hash = ?, email = ?, full_name = ? WHERE username = ?",
            [hash, "admin@meditrack.com", "Administrator", "admin"],
            (err, result) => {
                if (err) {
                    console.error("  ✗ update admin:", err.message);
                    // Try inserting instead
                    db.query(
                        "INSERT INTO users (username, password, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?, ?)",
                        ["admin", "admin123", "admin@meditrack.com", hash, "Administrator", "admin"],
                        (err2) => {
                            if (err2) console.error("  ✗ insert admin:", err2.message);
                            else console.log("  ✓ admin user inserted");
                            resolve();
                        }
                    );
                } else {
                    if (result.affectedRows === 0) {
                        db.query(
                            "INSERT INTO users (username, password, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?, ?)",
                            ["admin", "admin123", "admin@meditrack.com", hash, "Administrator", "admin"],
                            (err2) => {
                                if (err2) console.error("  ✗ insert admin:", err2.message);
                                else console.log("  ✓ admin user inserted");
                                resolve();
                            }
                        );
                    } else {
                        console.log("  ✓ admin user updated (admin / admin123)");
                        resolve();
                    }
                }
            }
        );
    });

    console.log("\n✓ Fix completed!");
    db.end();
}

fix().catch((err) => {
    console.error("Fix failed:", err.message);
    db.end();
    process.exit(1);
});
