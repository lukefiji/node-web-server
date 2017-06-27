const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

// If server doesn't provide port, default to 3000
const port = process.env.PORT || 3000;
const app = express();

// Sets handlebars partials to '/views/partials' folder
hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

// Register server logging middleware with app.use()
// -- Only continues after calling next()
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;

  // Log requests and timestamp
  fs.appendFile("server.log", log + "\n", err => {
    if (err) console.log("Unable to append to server.log");
  });
  console.log(log);
  next();
});

const MAINTENANCE_MODE = false;

// Maintenance mode middleware
app.use((req, res, next) => {
  if (MAINTENANCE_MODE) {
    res.render("maintenance", {
      pageTitle: "Maintenance"
    });
  }
  next();
});

// Setting root static folder:
// -- Use __dirname to give absolute path from
//    root of hard drive to current folder
app.use(express.static(__dirname + "/public"));

// getCurrentYear helper
// -- Handle bars looks through helpers first,
//    then variables second
hbs.registerHelper("getCurrentYear", () => new Date().getFullYear());

// You can apply arguments by adding a space after referencing it
hbs.registerHelper("screamIt", text => text.toUpperCase());

app.get("/", (req, res) => {
  res.render("home", {
    pageTitle: "Home Page",
    welcomeMessage: "Welcome to the home page."
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    pageTitle: "About Page"
  });
});

app.get("/projects", (req, res) => {
  res.render("projects", {
    pageTitle: "Projects"
  });
});

app.get("/bad", (req, res) => {
  res.send({
    error: "Unable to handle request"
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
