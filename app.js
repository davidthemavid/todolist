const express = require("express");
const bodyParser = require("body-parser");
let port = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  let today = new Date();

  let dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let date = today.toLocaleDateString("en-US", dateOptions);
  console.log(today);
  console.log(date);

  res.render("list", { day: date });
});

app.post("/", function(req, res) {
  let listItem = req.body.todo;
  console.log(listItem);
});

app.listen(port, function() {
  console.log("~~~ Server started on port " + port + " ~~~");
});
