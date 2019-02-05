const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { authenticate } = require("../auth/authenticate");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/stories", getStories);
  server.get("/api/stories/:id", getStory);
  server.post("/api/stories", authenticate, addStory);
  server.delete("/api/stories/:id", authenticate, deleteStory);
  server.put("/api/stories/:id", authenticate, editStory);
  server.get('/mystories/:id', authenticate, usersStories)
};

function generateToken(user) {
  const payload = { username: user.username };
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: "10h"
  };
  return jwt.sign(payload, secret, options);
}

function register(req, res) {
  const userInfo = req.body;
  const hash = bcrypt.hashSync(userInfo.password, 14);
  userInfo.password = hash;

  db("users")
    .insert(userInfo)
    .then(user => {
      res.status(201).send(`Thank you for registering. Your ID is ${user}`);
    })
    .catch(() => res.status(500).send(`error registering`));
}

function login(req, res) {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `Welcome ${user.username}`, token });
      } else {
        res.status(401).json({
          message: "Login failed. Please enter correct username and password."
        });
      }
    })
    .catch(() => res.status(500).send("Cannot reach server."));
}

function getStories(req, res) {
  //   const requestOptions = {
  //     headers: { accept: "application/json" }
  //   };

  db("stories")
    .then(story => {
      res.status(200).json(story);
    })
    .catch(() => res.status(500).json({ message: "error fetching stories" }));
}

function getStory(req, res) {
  db("stories")
    .where({ id: req.params.id })
    .then(story => {
      res.status(200).json(story);
    })
    .catch(() => res.status(500).json({ message: "error fetching story" }));
}

function addStory(req, res) {
  const story = req.body;

  db("stories")
    .insert(story)
    .then(response => {
      res.status(201).send(`Your story has been submitted`);
    })
    .catch(() =>
      res.status(500).send({ error: "error saving story to database." })
    );
}

function deleteStory(req, res) {
  db("stories")
    .where({ id: req.params.id })
    .del()
    .then(response => {
      res.status(200).send(`The story has been deleted`);
    })
    .catch(() => res.status(500).send(`error deleting story from server`));
}

function editStory(req, res) {
  const edit = req.body;

  db("stories")
    .where({ id: req.params.id })
    .update(edit)
    .then(response => {
      res.status(201).send("Story has been edited");
    })
    .catch(() => res.status(500).send(`story couldn't be saved to database`));
}

function usersStories(req, res) {
    db('stories')
    .where({ user_id: req.params.id })
    .then(stories => {
        res.status(200).send(stories)
    })
    .catch(() => res.status(500).send(`couldn't retrieve stories from database`))
}
