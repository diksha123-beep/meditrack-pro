# MediEquip — Medical Equipment Inventory Management

## Requirements
- Node.js and npm
- MySQL Server + MySQL Workbench

## 1. Database
1. Open MySQL Workbench and run `database/medical_equipment_db.sql` if creating the database for the first time.
2. Ensure your existing `equipment` and `notifications` tables exist.
3. Run `database/migration_notifications.sql` once to allow notification history after equipment deletion and support all event types.
4. Run `database/seed_10_equipment.sql` once to add 10 example equipment records.

## 2. Backend
1. Copy `backend/medical-equipment-backend/.env.example` to `.env`.
2. Set your local MySQL password in `.env` (do not share this file).
3. In terminal: `cd backend/medical-equipment-backend`, then `npm install`, then `node server.js`.
4. API base: `http://localhost:5000`. Notifications API: `http://localhost:5000/api/notifications`.

## 3. Frontend
Open another terminal: `cd frontend/medical-equipment-frontend`, `npm install`, `npm run dev`; open the Vite URL shown.

## Included improvements
- Event notifications for equipment add/delete/update and status changes (Available, In Use, Under Maintenance).
- Bell dropdown, unread count, mark-one-read and mark-all-read; polls every 15 seconds.
- Settings and Help & Support pages. Settings are saved in this browser.
- Floating robot-styled MediBot assistant with inventory answers and optional speech recognition (browser support required).
- Ten example equipment records in a separate seed script.

## Notes
MediBot is a rule-based assistant, not a generative AI service. Voice input uses the browser SpeechRecognition API when available. The example equipment is fictional demo data.
