const express = require("express");
const app = express();
const path = require("path");

const Translation = require(path.join(__dirname, "services/translation"));
Translation.loadLanguages();

app.use(express.static(path.join(__dirname, "static")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Load routes
const api = require(path.join(__dirname, "routes/api"));
const frontend = require(path.join(__dirname, "routes/frontend"));

app.use("/api", api);
app.use(frontend);

// Start the server
app.listen(3000, () => {
  console.info("App gestartet auf Port: 3000");
});