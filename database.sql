CREATE TABLE users(
 id SERIAL PRIMARY KEY,
 username TEXT UNIQUE,
 password TEXT,
 role TEXT DEFAULT 'user',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE slots(
 id SERIAL PRIMARY KEY,
 date DATE,
 hour INT,
 locked BOOLEAN DEFAULT FALSE
);

CREATE TABLE reservations(
 id SERIAL PRIMARY KEY,
 slot_id INT REFERENCES slots(id),
 owner_id INT REFERENCES users(id),
 type TEXT,
 pin INT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservation_players(
 id SERIAL PRIMARY KEY,
 reservation_id INT REFERENCES reservations(id),
 user_id INT REFERENCES users(id)
);
