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

const refreshTokens = [];

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
    return res.status(400).send("user not found!!!");
  }
  const isExists = await bcrypt.compare(password, user.password);

  if (isExists) {
    /**
     * * once the login is successful, next step is to generate JWT token to validate
     * * further request using the same. It is used for authorisation purpose
     */

    const payload = { username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = jsonwebtoken.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY);

    /**
     * * check if refreshtoken exists for the same user remove it and replace it with the new refreshToken
     */

    const _index = refreshTokens.findIndex((item) => item.username === user.username);

    if(_index > -1) {
      refreshTokens[_index] = { username:user.username, token: refreshToken  };
    } else {
      refreshTokens.push({ username:user.username, token: refreshToken  });
    }

    return res.status(200).json({ accessToken, refreshToken });
  }
  res.status(401).send("unauthorized");
});

app.post("/token",(req, res) => {
  const { token } = req.body;
  console.log(req.body);

  if(!token) {
    return res.status(400).send('invalid request');
  }

  const isTokenExists = refreshTokens.some((item)=> item.token === token);

  if(!isTokenExists) {
    return res.status(403).send('Forbidden request');
  }

  jsonwebtoken.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY, (err, payload) => {
    const _payload = { username: payload.username };
    const accessToken = generateAccessToken(_payload);
    res.status(201).json({ accessToken });
  })
})

app.delete('/logout', (req, res) => {
  const {token} = req.body;
  refreshTokens = refreshTokens.filter((item) => item.token !== token);
  res.sendStatus(204);
})

function generateAccessToken(payload) {
  return jsonwebtoken.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '20s' });
}

app.listen(3000, () => `listening on Port 3000`);
