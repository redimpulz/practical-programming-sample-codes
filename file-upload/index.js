const express = require("express");
const morgan = require("morgan");
const multer = require("multer");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

// const upload = multer({ dest: "uploads/" });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unixTime = new Date().getTime();
    const fileName = `${unixTime}_${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

app.post("/profile", upload.single("avatar"), (req, res) => {
  console.log(req.file);
  res.send("OK");
});

app.post("/photos/upload", upload.array("photos"), (req, res) => {
  console.log(req.files);
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
