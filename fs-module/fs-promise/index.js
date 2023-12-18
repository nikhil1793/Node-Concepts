const fs = require('fs/promises');
const path = require("path");


console.log("first")

fs.readFile(path.resolve(__dirname, "data.txt"), "utf8")
.then((data) => {console.log(data)})
.catch((err) => console.log(err));

console.log("second");

