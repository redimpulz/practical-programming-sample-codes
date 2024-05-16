const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
