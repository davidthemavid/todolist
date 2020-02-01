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
let weather = [];
let icon;

request(
  `http://api.ipstack.com/check?access_key=${ipKey}`,
  { json: true },
  (err, res, body) => {
    if (err) {
      console.log("ipStack error: " + err);
    } else {
      let lat = body.latitude;
      let long = body.longitude;
      request(
        `https://api.darksky.net/forecast/${key}/${lat},${long}`,
        { json: true },
        (err, res, body) => {
          console.log(res.statusCode);
          if (err) {
            console.log("DarkySky error: " + err);
          } else {
            let currentForcast = body.currently.summary;
            let weeklyForcast = body.daily.summary;
            let weatherType = body.currently.icon;

            forcast.push(currentForcast);
            weekForcast.push(weeklyForcast);
            weather.push(weatherType);
            console.log("icon : " + weatherType);
          }
        }
      );
    }
  }
);

//selects image based off darkSky icon value
if (weather === "clear-day" || "clear-night") {
  icon = "./images/sun.jpg";
} else if (weather === "rain") {
  icon = "./images/rain.jpg";
} else if (weather === "snow" || "sleet") {
  icon = "./images/snow.jpg";
} else {
  icon = "./images/overcast.jpg";
}
console.log(icon);

let items = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/");

app.get("/", (req, res) => {
  let today = new Date();

  let dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let date = today.toLocaleDateString("en-US", dateOptions);

  res.render("list", {
    day: date,
    newItem: items,
    weather: forcast,
    icon: icon
  });
});

app.post("/", (req, res) => {
  let listItem = req.body.addInput;
  items.push(listItem);

  res.redirect("/");
});

app.listen(port, () => {
  console.log("~~~ Server started on port " + port + " ~~~");
});
