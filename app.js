const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const config = require("./config.js");
const key = config.key;
const ipKey = config.ipKey;
const app = express();

let port = process.env.PORT || 3000;
let forcast = [];
let extendedForcast = [];
let weather = [];
let icon;
let temp = [];
let countryCode = [];

request(
  `http://api.ipstack.com/check?access_key=${ipKey}`,
  { json: true },
  (err, res, body) => {
    if (err) {
      console.log("ipStack error: " + err + res.statusCode);
    } else {
      let lat = body.latitude;
      let long = body.longitude;
      let country = body.country_code;
      countryCode.push(country);

      request(
        `https://api.darksky.net/forecast/${key}/${lat},${long}`,
        { json: true },
        (err, res, body) => {
          if (err) {
            console.log("DarkySky error: " + err + res.statusCode);
          } else {
            let currentForcast = body.currently.summary;
            let weeklyForcast = body.daily.summary;
            let weatherType = body.currently.icon;
            let currentTemp = body.currently.temperature;

            if (
              weatherType === "clear" ||
              weatherType === "clear-night" ||
              weatherType === "clear-day"
            ) {
              icon = "./images/sun.jpg";
            } else if (weatherType === "rain") {
              icon = "./images/rain.jpg";
            } else if (weatherType === "snow" || weatherType === "sleet") {
              icon = "./images/snow.jpg";
            } else if (weatherType === "fog") {
              icon = "./images/fog.jpg";
            } else {
              icon = "./images/overcast.jpg";
            }

            forcast.push(currentForcast);
            extendedForcast.push(weeklyForcast);
            weather.push(weatherType);
            temp.push(currentTemp);
          }
        }
      );
    }
  }
);

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
    extWeather: extendedForcast,
    icon: icon,
    temp: temp
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
