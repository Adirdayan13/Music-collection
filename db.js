const spicedPg = require("spiced-pg");

const db = spicedPg(
  process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/vinyls"
);

exports.addVinyl = function(artistname, album, genre, year, price) {
  return db
    .query(
      `
        INSERT INTO vinylstable (artistname, album, genre, year, price)
        VALUES
        ($1, $2, $3, $4, $5)`,
      [artistname, album, genre, year || 0, price || 0]
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

exports.addOrUpdate = function(id, artistname, album, genre, year, price) {
  return db.query(
    `UPDATE vinylstable SET
        artistname = $2, album = $3, genre = $4, year = $5, price = $6 WHERE id = $1`,
    [id, artistname, album, genre || " ", year || 0, price || 0]
  );
};
