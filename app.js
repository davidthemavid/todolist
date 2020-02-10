const express = require("express");
const bodyParser = require("body-parser");
const rq = require("request-promise-native");
const config = require("./config.js");
let key = config.key;
let ipKey = config.ipKey;
const app = express();
let port = process.env.PORT || 3000;

let forcast = [];
let weather = [];
let temp = [];
let icon;

rq(`http://api.ipstack.com/check?access_key=${ipKey}`, { json: true })
  .then((response, body) => {
    let lat = response.latitude;
    let long = response.longitude;
    let country = response.country_code;

    rq(`https://api.darksky.net/forecast/${key}/${lat},${long}`, {
      json: true
    }).then((response, body) => {
      let weatherImage = response.currently.icon;
      let currentWeather = response.currently.summary;
      let dailyForcast = response.daily.summary;
      let currentTemp = response.currently.temperature;
      let conversion =
        country != "us"
          ? (currentTemp = (currentTemp - 32) * (5 / 9))
          : currentTemp;
      let correctTemp = conversion.toString().slice(0, 3);

      temp.push(correctTemp);
      weather.push(currentWeather);
      forcast.push(dailyForcast);

      if (weatherImage.includes("clear")) {
        icon = "./images/sun.jpg";
      } else if (weatherImage.includes("rain")) {
        icon = "./images/rain.jpg";
      } else if (weatherImage.includes("snow", "sleet")) {
        icon = "./images/snow.jpg";
      } else if (weatherImage.includes("fog")) {
        icon = "./images/fog.jpg";
      } else {
        icon = "./images/overcast.jpg";
      }
    });
  })
  .catch(error => {
    console.log("~~~ Error encountered : " + error);
  });

let items = [];
let groceries = [];

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
    title: "It's " + date,
    newItem: items,
    weather: weather,
    extWeather: forcast,
    icon: icon,
    temp: temp
  });
});

app.post("/", (req, res) => {
  let listItem = req.body.addInput;
  items.push(listItem);

  res.redirect("/");
});

app.get("/groceries", (req, res) => {
  res.render("list", {
    title: "Grocery List",
    newItem: groceries,
    weather: weather,
    extWeather: forcast,
    icon: icon,
    temp: temp
  });
});

app.post("/groceries", (req, res) => {
  let listItem = req.body.addInput;
  groceries.push(listItem);

  res.redirect("/groceries");
});

app.listen(port, () => {
  console.log("~~~ Server started on port " + port + " ~~~");
});
