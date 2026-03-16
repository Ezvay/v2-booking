const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function init() {

await pool.query(`
CREATE TABLE IF NOT EXISTS users(
 id SERIAL PRIMARY KEY,
 username TEXT UNIQUE,
 password TEXT,
 role TEXT DEFAULT 'user',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS slots(
 id SERIAL PRIMARY KEY,
 date DATE,
 hour INT,
 locked BOOLEAN DEFAULT FALSE
);
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS reservations(
 id SERIAL PRIMARY KEY,
 slot_id INT REFERENCES slots(id),
 owner_id INT REFERENCES users(id),
 type TEXT,
 pin INT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS reservation_players(
 id SERIAL PRIMARY KEY,
 reservation_id INT REFERENCES reservations(id),
 user_id INT REFERENCES users(id)
);
`);

console.log("Database initialized");

process.exit();
}

init();
