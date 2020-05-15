const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: true }));

app.get("/api/hello-world", (req, res) => {
  res.status(200).send("hello world");
});

app.post("/api/clock-in", (req, res) => {
  (async () => {
    res.status(200).send("clock in was successful!");
  })();
});

app.put("/api/clock-out", (req, res) => {
  (async () => {
    res.status(200).send("clock out was successful!");
  })();
});

app.get("/api/select-all", (req, res) => {
  (async () => {
    res.status(200).send("select all was successful!");
  })();
});

app.delete("/api/delete-all", (req, res) => {
  (async () => {
    res.status(200).send("delete all was successful!");
  })();
});

exports.app = functions.https.onRequest(app);
