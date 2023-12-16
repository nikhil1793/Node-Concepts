const express = require("express");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.status(200).json(users);
});

app.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;
    // * const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashPassword };
    users.push(user);
    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).send("unauthorized");
  }
  const isExists = await bcrypt.compare(password, user.password);

  if (isExists) {
    return res.status(200).send("login success!!!!");
  }
  res.status(401).send("unauthorized");
});

app.listen(3000, () => `listening on Port 3000`);
