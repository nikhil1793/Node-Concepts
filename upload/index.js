const path = require("path");
const multer = require("multer");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello from the upload server");
});

/**
 * * below approach upload the file in unknown / binary format 
 * * so we will use other apprach to upload to support spepcific format
 * 
    const upload = multer({ dest: path.resolve(__dirname, "uploads") });

    app.post("/upload", upload.array("avatar", 10) , (req, res) => {
        console.log(req.file);
        console.log(req.body);
        res.send({});
    });
 * 
 */

/**
 * * The disk storage engine gives you full control on storing files to disk.
 * * There are two options available, destination and filename. They are both functions that determine where the file should be stored.
 * * filename is used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
 * ! Note: Multer will not append any file extension for you, your function should return a filename complete with an file extension.
 */

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve(__dirname, "static"));
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("avatar"), (req, res) => {
  res.send({});
});

app.listen(4000, () => console.log(`listening on port 4000`));
