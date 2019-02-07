const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { authenticate } = require("../auth/authenticate");

module.exports = server => {
  server.post("/api/register", register),
    server.post("/api/login", login),
    server.get("/api/stories", getStories),
    server.get("/api/stories/:id", getStory),
    server.post("/api/stories", addStory),
    server.delete("/api/stories/:id", authenticate, deleteStory),
    server.put("/api/stories/:id", authenticate, editStory),
    server.get("/mystories/:id", authenticate, usersStories);
    server.get('/api/donations', getDonations);
    server.post('/api/donations', addDonation);
};

function generateToken(user) {
  const payload = { username: user.username };
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: "24h"
  };
  return jwt.sign(payload, secret, options);
}

function register(req, res) {
  const userInfo = req.body;
  const hash = bcrypt.hashSync(userInfo.password, 14);
  userInfo.password = hash;
  if (
    userInfo.username === null ||
    userInfo.title === null ||
    userInfo.country === null ||
    userInfo.email === null ||
    userInfo.password === null
  ) {
    res.status(422).send({ error: "information incomplete " });
  } 
    db("users")
      .insert(userInfo)
      .then(ids => {
        db("users")
          .where({ id: ids[0] })
          .then(user => {
            res
              .status(201)
              .send('succuess');
          })
          .catch(() =>
            res.status(405).send({ error: "information incomplete." })
          );
      })
      .catch(() => res.status(405).send(`error registering`));
  }


function login(req, res) {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);
        const id = user.id;
        const type = user.title;
        const country = user.country;
        const username = user.username
        const response = { token, id, type, country, username };
        res.status(200).send(response);
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
      res.status(200).send(story);
    })
    .catch(() => res.status(500).json({ message: "error fetching stories" }));
}

function getStory(req, res) {
  db("stories")
    .where({ id: req.params.id })
    .then(story => {
      res.status(200).send(story);
    })
    .catch(() => res.status(500).json({ message: "error fetching story" }));
}

function addStory(req, res) {
  const story = req.body;

  db("stories")
    .insert(story)
    .then(response => {
      db("stories").then(stories => {
        res.status(201).send(stories);
      });
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
      db("stories").then(stories => {
        res.status(201).send(stories);
      });
    })
    .catch(() => res.status(500).send(`error deleting story from server`));
}

function editStory(req, res) {
  const edit = req.body;

  db("stories")
    .where({ id: req.params.id })
    .update(edit)
    .then(response => {
      db("stories").then(stories => {
        res.status(201).send(stories);
      });
    })
    .catch(() => res.status(500).send(`story couldn't be saved to database`));
}

function usersStories(req, res) {
  db("stories")
    .where({ user_id: req.params.id })
    .then(stories => {
      res.status(200).send(stories);
    })
    .catch(() =>
      res.status(500).send(`couldn't retrieve stories from database`)
    );
}

function getDonations(req, res) {
  db("donations")
    .then(donations => {
      res.status(200).send(donations);
    })
    .catch(() => res.status(500).json({ message: "error fetching donations" }));
}

function addDonation(req, res) {
  const donation = req.body;

  db("donations")
    .insert(donation)
    .then(response => {
      db("donations").then(donations => {
        res.status(201).send(donations);
      });
    })
    .catch(() =>
      res.status(500).send({ error: "error saving donation to database." })
    );
}
