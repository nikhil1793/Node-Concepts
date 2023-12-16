const express = require("express");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

/**
 * * configure the dot env to get the env variables
 */
require("dotenv").config();

/**
 * ? for generating secrey keys - console.log(require('crypto').randomBytes(64).toString('hex'))
 */

const app = express();

app.use(express.json());

const users = [];

const posts = [
  {
    author: "Mark Wright",
    title: "JWT implementation with Refresh Token",
  },
  {
    author: "Bruce Wayne",
    title: "Dark Night Rises",
  },
];

app.get("/users", (req, res) => {
  res.status(200).json(users);
});

app.get("/posts", authenticateToken, (req, res) => {
  console.log(req.user);
  res.send(posts.filter((post) => post.author === req.user.username));
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
    return res.status(400).send("user not found!!!");
  }
  const isExists = await bcrypt.compare(password, user.password);

  if (isExists) {
    /**
     * * once the login is successful, next step is to generate JWT token to validate
     * * further request using the same. It is used for authorisation purpose
     */

    const payload = { username: user.username };
    const accessToken = jsonwebtoken.sign(payload, process.env.ACCESS_SECRET_KEY);
    return res.status(200).json({ accessToken });
  }
  res.status(401).send("unauthorized");
});

function authenticateToken(req, res, next) {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send("unauthorized");
  }

  jsonwebtoken.verify(token, process.env.ACCESS_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(403).send("token invalid!!!!");
    }
    req.user = payload;
    next();
  });
}

app.listen(3000, () => `listening on Port 3000`);
