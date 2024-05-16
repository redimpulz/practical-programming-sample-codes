const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;
const mysql = require("mysql");

require("dotenv").config();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

const { verifyIdToken } = require("./firebaseAdmin");
app.use(verifyIdToken);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  // SQLインジェクション対策
  stringifyObjects: true,
});

connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("success");
});

app.post("/createUser", (req, res) => {
  connection.query(
    "SELECT * FROM user WHERE uid = ?",
    [req.uid],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("error");
        return;
      }
      if (results.length) {
        res.send("ok");
        return;
      }
      connection.query(
        "INSERT INTO user (uid, email) VALUES (?, ?)",
        [req.uid, req.email],
        (error) => {
          if (error) {
            console.log(error);
            res.status(500).send("error");
            return;
          }
          res.send("ok");
        }
      );
    }
  );
});

app.get("/todo", (req, res) => {
  // console.log(req.headers);
  console.log(req.uid);
  console.log(req.email);
  connection.query(
    "SELECT * FROM todo WHERE uid = ? AND deleted_at IS NULL",
    [req.uid],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("error");
        return;
      }
      res.json(results);
    }
  );
});

app.post("/todo", (req, res) => {
  const todo = {
    status: req.body.status,
    task: req.body.task,
  };
  connection.query(
    "INSERT INTO todo (status, task, uid) VALUES (?, ?, ?)",
    [todo.status, todo.task, req.uid],
    (error) => {
      if (error) {
        console.log(error);
        res.status(500).send("error");
        return;
      }
      res.send("ok");
    }
  );
});

app.put("/todo/:todoId", (req, res) => {
  const todoId = req.params.todoId;
  const todo = {
    status: req.body.status,
    task: req.body.task,
  };
  connection.query(
    "UPDATE todo SET status = ?, task = ? WHERE id = ? AND uid = ? AND deleted_at IS NULL",
    [todo.status, todo.task, todoId, req.uid],
    (error) => {
      if (error) {
        console.log(error);
        res.status(500).send("error");
        return;
      }
      res.send("ok");
    }
  );
});

app.delete("/todo/:todoId", (req, res) => {
  const todoId = req.params.todoId;
  connection.query(
    "UPDATE todo SET deleted_at = ? WHERE id = ? AND uid = ?",
    [new Date(), todoId, req.uid],
    (error) => {
      if (error) {
        console.log(error);
        res.status(500).send("error");
        return;
      }
      res.send("ok");
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
