DROP TABLE IF EXISTS vinylstable CASCADE;

CREATE TABLE vinylstable(
    id SERIAL PRIMARY KEY,
    artistname VARCHAR,
    album VARCHAR,
    genre VARCHAR,
    year INT,
    price DECIMAL
);
