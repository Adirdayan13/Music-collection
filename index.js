const db = require("./db");
const express = require("express");
const app = express();
const hb = require("express-handlebars");
var helpers = require("handlebars-helpers")();
var sum = helpers.sum();

// configures express to use express-handlebars
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(
  express.urlencoded({
    extended: false
  })
);

// serve your static files - public
app.use(express.static("./public"));

app.use(function(req, res, next) {
  res.set("x-frame-options", "DENY");
  next();
});

//// ROUTES /////
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  console.log("GET HOME");
  let pricesArr = [];
  db.getVinyl()
    .then(results => {
      results.forEach(result => {
        pricesArr.push(result.price);
      });
      res.render("welcome", {
        results,
        pricesArr: pricesArr
      });
    })
    .catch(err => {
      console.log("error from get vinyl: ", err);
    });
});

app.post("/addvinyl", (req, res) => {
  console.log("POST ADD VINYL");
  let artistname = req.body.artistname;
  let album = req.body.album;
  let genre = req.body.genre;
  let year = req.body.year;
  let price = req.body.price;
  console.log("req.body: ", req.body);
  if (!artistname || !album) {
    res.redirect("/home");
    return;
  }

  db.addVinyl(artistname, album, genre, year, price)
    .then(() => {
      res.redirect("/home");
    })
    .catch(err => {
      console.log("error from add vinyl: ", err);
    });
});

app.get("addvinyl", (req, res) => {
  console.log("GET ADDVINYL REDIRECT to HOME");
  res.redirect("/home");
});

app.post("/edit", (req, res) => {
  console.log("POST EDIT");
  let id = req.body.id;
  let artistname = req.body.artistname;
  let album = req.body.album;
  let genre = req.body.genre;
  let year = req.body.year;
  let price = req.body.price;
  if (!artistname || !album) {
    res.redirect("/home");
    return;
  }
  db.addOrUpdate(id, artistname, album, genre, year, price)
    .then(results => {
      if (results.rowCount == 0) {
        db.getVinyl().then(results => {
          res.render("welcome", {
            results,
            numberNotFound: "numberNotFound"
          });
        });
        return;
      }
      db.getVinyl().then(results => {
        res.render("welcome", {
          results
        });
      });
    })
    .catch(err => {
      console.log("error from addOrUpdate: ", err);
      db.getVinyl().then(results => {
        res.render("welcome", {
          results,
          numberNotFound: "numberNotFound",
          edit: "edit"
        });
      });
    });
});

app.get("/edit", (req, res) => {
  console.log("GET EDIT");
  // let pricesArr = [];
  db.getVinyl()
    .then(results => {
      res.render("welcome", {
        results,
        edit: "edit"
        // pricesArr: "pricesArr"
      });
    })
    .catch(err => {
      console.log("error from get vinyl: ", err);
    });
});

app.get("/add", (req, res) => {
  console.log("GET ADD");
  db.getVinyl()
    .then(results => {
      res.render("welcome", {
        results,
        add: "add"
      });
    })
    .catch(err => {
      console.log("error from get vinyl: ", err);
    });
});

app.get("/delete", (req, res) => {
  db.getVinyl()
    .then(results => {
      res.render("welcome", {
        results,
        delete: "delete"
      });
    })
    .catch(err => {
      console.log("error from get vinyl: ", err);
    });
});

app.post("/deletevinyl", (req, res) => {
  console.log("POST DELETEVINYL");
  const deleteId = req.body.idDelete;
  db.deleteVinylById(deleteId)
    .then(results => {
      if (results.rowCount == 0) {
        db.getVinyl()
          .then(results => {
            res.render("welcome", {
              results,
              numberNotFound: "numberNotFound"
            });
          })
          .catch(err =>
            console.log("error from get vinyl in post delete: ", err)
          );
        return;
      }
      res.redirect("/home");
    })
    .catch(err => {
      db.getVinyl()
        .then(results => {
          res.render("welcome", {
            results,
            numberNotFound: "numberNotFound"
          });
        })
        .catch(err =>
          console.log("error from get vinyl in post delete: ", err)
        );
    });
});

app.get("/404", function(req, res, next) {
  console.log("404");
  next();
});

app.use(function(req, res, next) {
  res.status(404);

  res.format({
    html: function() {
      res.render("404", { url: req.url });
    },
    json: function() {
      res.json({ error: "Not found" });
    },
    default: function() {
      res.type("txt").send("Not found");
    }
  });
});

console.log(require.main == module);

if (require.main == module) {
  app.listen(process.env.PORT || 8080, () =>
    console.log("8080 fucking running")
  );
}
