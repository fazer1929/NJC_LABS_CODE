const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Establishing A Connection
let db = new sqlite3.Database("./moviedb.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the Movie database.");
});

//Creating a Table "movie"
db.run(
  "create table movies(name varchar(50),actor varchar(30),actress varchar(30),director varchar(30),yearofrel int);",
  (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Created A new Table");
    }
  }
);

//Server Files
app.get("/", async (req, res) => {
  let sql = `SELECT * FROM movies`;
  let data = [];
  await db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    data = rows;
    res.render("index", { data });
  });
});

app.post("/addMovie", (req, res) => {
  const { name, actor, actress, director, yearofrel } = req.body;
  db.run(
    `INSERT INTO movies(name,actor,actress,director,yearofrel) VALUES(?,?,?,?,?)`,
    [name, actor, actress, director, yearofrel],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  );
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
