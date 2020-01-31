const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const config = require("./config.js");
const key = config.key;
const ipKey = config.ipKey;
const app = express();

let port = process.env.PORT || 3000;
let forcast = [];
let weekForcast = [];

request(`http://api.ipstack.com/check?access_key=${ipKey}`, { json: true }, (err, res, body) => {
  if (err) {
    console.log("first error" + err);
  } else {
    let lat = body.latitude;
    let long = body.longitude;
    request(
      `https://api.darksky.net/forecast/${key}/${lat},${long}`,
      { json: true },
      (err, res, body) => {
        console.log(res.statusCode);
        if (err) {
          console.log("2nd error" + err);
        } else {
          let currentForcast = body.minutely.summary;
          let weeklyForcast = body.daily.summary;
          forcast.push(currentForcast);
          weekForcast.push(weeklyForcast);
        }
      }
    );
  }
});

let items = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/");

app.get("/", function(req, res) {
  let today = new Date();

  let dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let date = today.toLocaleDateString("en-US", dateOptions);

  res.render("list", { day: date, newItem: items, weather: forcast });
});

app.post("/", function(req, res) {
  let listItem = req.body.addInput;
  items.push(listItem);

  res.redirect("/");
});

app.listen(port, function() {
  console.log("~~~ Server started on port " + port + " ~~~");
});
