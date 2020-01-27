const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config.js");
const key = config.key;

//https://darksky.net/dev/docs
let lat = "";
let long = "";
let darkSky = `https://api.darksky.net/forecast/${key}/${lat},${long}`;
let port = process.env.PORT || 3000;

const app = express();
let items = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
  let today = new Date();

  let dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let date = today.toLocaleDateString("en-US", dateOptions);

  res.render("list", { day: date, newItem: items });
});

app.post("/", function(req, res) {
  let listItem = req.body.addInput;
  items.push(listItem);

  res.redirect("/");
});

app.listen(port, function() {
  console.log("~~~ Server started on port " + port + " ~~~");
});
