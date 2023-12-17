const API_KEY = "855ddb55dee1711428a87ccca68967c6";

const body = document.body;

const toggleTitle = document.querySelector(".dashboard__toggle-title");

const allDiv = document.querySelectorAll("div");
console.log(allDiv);

const searchInput = document.querySelector(".dashboard__input");
const searchForm = document.querySelector(".dashboard__form");

const cityName = document.querySelector(".dashboard__info-city");
const tempName = document.querySelector(".dashboard__temp");

const feelsName = document.querySelector(".dashboard__feels-temp");

const humidityName = document.querySelector(
  ".dashboard__detail-amount.humidity"
);
const windName = document.querySelector(".dashboard__detail-amount.wind");
const pressureName = document.querySelector(
  ".dashboard__detail-amount.pressure"
);

const daystemp = document.querySelectorAll(".dashboard__forecast-5days-temp");

const weatherIcon = document.querySelector(".dashboard__type-weather-icon");
const weatherName = document.querySelector(".dashboard__type-weather-name");

const hourIcon = document.querySelector(".dashboard__forecast-hourly-icon");

const sunriseHTML = document.querySelector(".dashboard__time.sunrise");
const sunsetHTML = document.querySelector(".dashboard__time.sunset");

const dayHTML = document.querySelector(".dashboard__info-date");
const dayArr = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const modeIndicator = document.querySelector(".dashboard__toggle-indicator");

const mode = document.querySelector(".dashboard__toggle");

const info = document.querySelector(".dashboard__info");
const weather = document.querySelector(".dashboard__weather");
const forecastDays = document.querySelector(".dashboard__forecast-5days");
const forecastHour = document.querySelector(".dashboard__forecast-hourly");

const search = document.querySelector(".dashboard__search-wrapper");

const input = document.querySelector(".dashboard__input");

const hourlyLayout = document.querySelectorAll(
  ".dashboard__forecast-hourly-layout"
);
const hourlyWrapper = document.querySelector(
  ".dashboard__forecast-hourly-wrapper"
);

function enableLight() {
  modeIndicator.classList.toggle("active");
  toggleTitle.textContent = "Light Mode";
  localStorage.setItem("mode", "light");
  body.classList.add("light");

  info.classList.toggle("light");
  weather.classList.toggle("light");

  forecastDays.classList.toggle("light");
  forecastHour.classList.toggle("light");
  search.classList.toggle("light");
  input.classList.toggle("light");
}

function disableLight() {
  localStorage.setItem("mode", "dark");
  toggleTitle.textContent = "Dark Mode";
  modeIndicator.classList.remove("active");
  body.classList.remove("light");

  info.classList.remove("light");
  weather.classList.remove("light");
  forecastDays.classList.remove("light");
  forecastHour.classList.remove("light");
  search.classList.remove("light");
  input.classList.remove("light");
}

mode.addEventListener("click", () => {
  const mode = localStorage.getItem("mode");
  mode !== "light" ? enableLight() : disableLight();
});

const LS_MODE = localStorage.getItem("mode");

LS_MODE === "light" ? enableLight() : disableLight();

const infoTime = document.querySelector(".dashboard__info-time");

const monthArr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const dayWrapper = document.querySelector(".dashboard__forecast-5days-wrapper");

async function getData(url) {
  const res = await fetch(url);
  return res.json();
}

searchForm.onsubmit = async function (e) {
  e.preventDefault();
  const inputValue = searchInput.value.trim();
  const FIND_URL = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${API_KEY}&units=metric`;
  const resultCoord = await getData(FIND_URL);

  const lat = resultCoord.coord.lat;
  const long = resultCoord.coord.lon;

  const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`;
  const forecast = await getData(FORECAST_URL);

  renderHTML(resultCoord);
  hourlyWrapper.innerHTML = "";
  renderHourlyForecast(forecast);
  dayWrapper.innerHTML = "";
  renderDaysForecast(forecast);
};

function renderHTML(API_INFO) {
  const icon = API_INFO.weather[0].icon;
  weatherIcon.src = ` https://openweathermap.org/img/wn/${icon}@2x.png`;

  const weather = API_INFO.weather[0].main;
  weatherName.innerHTML = `<p class="dashboard__type-weather-name">${weather}</p>`;

  const city = API_INFO.name;
  cityName.innerHTML = `<h1 class="dashboard__info-city">${city}</h1>`;

  const temp = Math.round(API_INFO.main.temp);
  tempName.innerHTML = `<p class="dashboard__temp">${temp}°C</p>`;

  const feelsTemp = Math.round(API_INFO.main.feels_like);
  feelsName.innerHTML = `<p class="dashboard__feels-temp">${feelsTemp}°C</p>`;

  const humidity = API_INFO.main.humidity;
  humidityName.innerHTML = `<p class="dashboard__detail-amount humidity">${humidity}%</p>`;

  const wind = Math.round(API_INFO.wind.speed);
  windName.innerHTML = `<p class="dashboard__detail-amount wind">${wind}km/h</p>`;

  const pressure = API_INFO.main.pressure;
  pressureName.innerHTML = `<p class="dashboard__detail-amount pressure">${pressure}hPa</p>`;

  console.log(API_INFO);

  const sunrise = new Date(API_INFO.sys.sunrise * 1000);
  const sunriseMin = sunrise.getMinutes();
  const sunriseHour = sunrise.getHours();
  const sunriseAmPm = sunriseHour >= 12 ? "PM" : "AM";

  const sunset = new Date(API_INFO.sys.sunset * 1000);
  const sunsetMin = sunset.getMinutes();
  const sunsetHour = sunset.getHours();
  const sunsetAmPm = sunsetHour > 12 ? "PM" : "AM";

  sunriseHTML.innerHTML = `<p class="dashboard__time sunrise">${sunriseHour}:${sunriseMin} ${sunriseAmPm}</p>`;
  sunsetHTML.innerHTML = `<p class="dashboard__time sunset">${sunsetHour}:${sunsetMin} ${sunsetAmPm}</p>`;

  const timeDay = new Date(API_INFO.dt * 1000);

  const day = timeDay.getDay();

  const date = timeDay.getDate();

  const month = timeDay.getMonth();

  dayHTML.innerHTML = `<p class="dashboard__info-date">${dayArr[day]}, ${date} ${monthArr[month]}</p>`;

  infoTime.textContent = getTime(API_INFO);
}

function renderHourlyForecast(obj) {
  const list = obj.list;
  for (let i = 0; i < 5; i++) {
    const hourlyLayout = document.createElement("div");

    const time = new Date(list[i].dt * 1000);
    const timeMin = time.getMinutes();
    const timeHour = time.getHours();

    const hourAndMin = timeHour + ":" + timeMin;

    const icon = list[i].weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    hourlyLayout.className = "dashboard__forecast-hourly-layout";
    hourlyLayout.innerHTML = `<p class="dashboard__forecast-hourly-time">${hourAndMin}0</p>
    <img
      src="${iconURL}"
      alt="${list[i].weather[0].main}"
      class="dashboard__forecast-hourly-icon"
    />
    <p class="dashboard__forecast-hourly-temp">${Math.round(
      list[i].main.temp
    )}°C</p>
    <img
      src="./img/wind/navigation-up.png"
      alt="icon"
      class="dashboard__forecast-hourly-wind-icon"
    />
    <p class="dashboard__forecast-hourly-wind">${Math.round(
      list[i].wind.speed
    )}km/h</p>`;
    const deg = list[i].wind.deg;
    const windIcon = hourlyLayout.querySelector(
      ".dashboard__forecast-hourly-wind-icon"
    );
    windIcon.style.transform = `rotate(${deg}deg)`;
    hourlyWrapper.append(hourlyLayout);
  }
}

function renderDaysForecast(obj) {
  const list = obj.list;
  for (let i = 0; i < list.length; i += 8) {
    const div = document.createElement("div");

    const date = new Date(list[i].dt * 1000);
    const dateDay = date.getDay();

    const getDate = date.getDate();

    const icon = list[i].weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const month = date.getMonth();

    div.className = "dashboard__forecast-5days-layout";
    div.innerHTML = `               
    <img
    src="${iconURL}"
    alt="${list[i].weather[0].main}"
    class="dashboard__forecast-5days-icon"
  />
  <p class="dashboard__forecast-5days-temp">${Math.round(
    list[i].main.temp
  )}°C</p>
  <p class="dashboard__forecast-5days-date">${dayArr[dateDay]}, ${getDate} ${
      monthArr[month]
    }</p>`;
    dayWrapper.append(div);
  }
}

function getTime(API) {
  const time = new Date(API.dt * 1000);
  const hour = time.getHours();
  const minutes = "0" + time.getMinutes();
  console.log(time);
  return hour + ":" + minutes.substr(-2);
}
