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
  -- link TEXT NOT NULL,
  -- margin INTEGER CHECK (margin <= 20),
  -- size INTEGER CHECK (size <= 1000),
  -- code_color TEXT NOT NULL,
  -- bg_color TEXT NOT NULL,
  -- img VARCHAR,
  -- img_ratio NUMERIC CHECK (img_ratio <= 1.0),
  description VARCHAR(50),
  last_edited DATE NOT NULL,
  url VARCHAR
);