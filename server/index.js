const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const CONFIG = require("../config.js");

const verification = require("./verification.js");
const database = require("./database/database.js");

const app = express();

require("dotenv").config({ path: path.join(__dirname, "../.env") });
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3001", credentials: true }));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.post("/api/login", (req, res) => {
  database.verifyUser(req.body.username, req.body.password, res);
});

app.post("/api/logout", (req, res) => {
  res.status(401);
  res.clearCookie("token");
  res.send({ message: "logout" });
});

app.get("/api/events", verification.checkVerification, (req, res) => {
  
  database.fetchEvents().then((events) => {
    res.status(200);
    res.send(events);
  });
});

app.post('/api/register', verification.checkVerification, (req, res) => {
  database.registerMember(req.body).then((result) => {
    res.status(200);
    res.send({ message: "Sėkmingai užregistruota" });
  }).catch((err) => {
    res.status(500);
    res.send({ message: err });
  });
});

app.post('/api/members', verification.checkVerification, (req, res) => {
  database.fetchMembers(req.body.eventId).then((members) => {
    res.status(200);
    res.send(members);
  });
});

app.delete('/api/members', verification.checkVerification, (req, res) => {
  database.deleteMember(req.body.id).then(() => {
    res.status(200);
    res.send({ message: "Sėkmingai ištrinta" });
    
  });
});

app.post('/api/members/update', verification.checkVerification, (req, res) => {
  console.log('update', req.body)

  database.updateMember(req.body).then(() => {
    res.status(200);
    res.send({ message: "Sėkmingai atnaujinta" });
  }).catch((err) => {
    res.status(500);
    res.send({ message: err });
  });
});

app.get("/api/checkToken", verification.checkVerification, (req, res) => {
  res.send({ message: "success"});
});
