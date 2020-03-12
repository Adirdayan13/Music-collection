DROP TABLE IF EXISTS vinylstable CASCADE;

CREATE TABLE vinylstable(
    id SERIAL PRIMARY KEY,
    artistfirst VARCHAR,
    artistlast VARCHAR,
    album VARCHAR,
    genre VARCHAR,
    year INT,
    price DECIMAL
);
