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

app.get("/posts", authenticateToken, (req, res) => {
  console.log(req.user);
  res.send(posts.filter((post) => post.author === req.user.username));
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

app.listen(4000, () => `listening on Port 4000`);
