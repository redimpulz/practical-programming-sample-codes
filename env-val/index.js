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

app.get("/todo", (req, res) => {
  connection.query(
    "SELECT * FROM todo WHERE deleted_at IS NULL",
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
    // "INSERT INTO todo SET ?",
    // todo,
    "INSERT INTO todo (status, task) VALUES (?, ?)",
    [todo.status, todo.task],
    (error, results) => {
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
    "UPDATE todo SET status = ?, task = ? WHERE id = ? AND deleted_at IS NULL",
    [todo.status, todo.task, todoId],
    (error, results) => {
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
    "UPDATE todo SET deleted_at = ? WHERE id = ?",
    [new Date(), todoId],
    (error, results) => {
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
