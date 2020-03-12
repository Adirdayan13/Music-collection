const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/vinyls"
);

exports.addVinyl = function(
    artistfirst,
    artistlast,
    album,
    genre,
    year,
    price
) {
    return db
        .query(
            `
        INSERT INTO vinylstable (artistfirst, artistlast, album, genre, year, price)
        VALUES
        ($1, $2, $3, $4, $5, $6)`,
            [artistfirst, artistlast, album, genre, year || 0, price || 0]
        )
        .then(({ rows }) => rows);
};

exports.getVinyl = function() {
    return db
        .query(
            `
        SELECT * FROM vinylstable ORDER BY id DESC`
        )
        .then(({ rows }) => rows);
};

exports.getVinylBy = function(id) {
    return db.query(
        `
        SELECT * FROM vinylstable WHERE id = $1`,
        [id]
    );
};

exports.deleteVinylById = function(id) {
    return db.query(`DELETE FROM vinylstable WHERE id = $1`, [id]);
};

exports.addOrUpdate = function(
    id,
    artistfirst,
    artistlast,
    album,
    genre,
    year,
    price
) {
    return db.query(
        `UPDATE vinylstable SET
        id = $1, artistfirst = $2, artistlast = $3, album = $4, genre = $5, year = $6, price = $7 WHERE id = $1`,
        [
            id,
            artistfirst || " ",
            artistlast || " ",
            album || " ",
            genre || " ",
            year || 0,
            price || 0
        ]
    );
};
