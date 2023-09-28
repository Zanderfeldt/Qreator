CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);

CREATE TABLE qr_codes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE, 
  description VARCHAR(50),
  last_edited VARCHAR NOT NULL,
  url VARCHAR
);