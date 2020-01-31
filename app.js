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

//https://darksky.net/dev/docs
//vancouver lat/long
let lat = "49.2820";
let long = "-123.1207";
let darkSky = `https://api.darksky.net/forecast/${key}/${lat},${long}`;
let ipStack = `http://api.ipstack.com/check?access_key=${ipKey}`;

request(`${ipStack}`, { json: true }, (err, res, body) => {
  console.log(res.statusCode);
  console.log(body.city);
});

request(`${darkSky}`, { json: true }, (err, res, body) => {
  if (!err && res.statusCode == 200) {
    //console.log(res.statusCode);
    let currentForcast = body.minutely.summary;
    let weeklyForcast = body.daily.summary;
    forcast.push(currentForcast);
    weekForcast.push(weeklyForcast);
    //console.log(forcast);
  } else {
    console.log("DarkSky error" + err);
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
