console.log("This is the start of our Sprint");

document.addEventListener("DOMContentLoaded", async function () {
  //顯示時間畫面渲染
  renderDateAndWeekday();

  //先載入臺中市天氣
  try {
    const defaultCity = "臺中市";

    const todayData = await fetchTodayWeatherForCity(defaultCity);
    renderTodayWeather(todayData);

    const weekData = await fetchWeekWeatherForCity(defaultCity);
    renderWeekWeather(weekData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }

  //監聽下拉式選單，處理後續畫面呈現
  const dropDownList = document.getElementById("selectedCity");
  dropDownList.addEventListener("change", async function () {
    const cityNameValue = dropDownList.value;

    if (cityNameValue) {
      try {
        const todayData = await fetchTodayWeatherForCity(cityNameValue);
        renderTodayWeather(todayData);

        const weekData = await fetchWeekWeatherForCity(cityNameValue);
        renderWeekWeather(weekData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
  });
});

//渲染當天日期資訊
function renderDateAndWeekday() {
  //獲取現在時間
  const currentDateInfo = getDateInfo();

  const dayOfTheWeek = document.querySelector(".dayOfTheWeek");
  const date = document.querySelector(".date");

  dayOfTheWeek.textContent = `${currentDateInfo.dayOfWeek}`;
  date.textContent = `${currentDateInfo.year}-${currentDateInfo.month}-${currentDateInfo.day}`;
}

//取得當天日期資訊
function getDateInfo(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];

  return {
    year: year,
    month: month,
    day: day,
    dayOfWeek: dayOfWeek,
  };
}

//取得當天的天氣資訊
async function fetchTodayWeatherForCity(city) {
  try {
    const response = await fetch(
      `/api/today_weather?search=${city}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "There was a problem fetching the today weather data:",
      error.message
    );
  }
}

//渲染當天天氣畫面
function renderTodayWeather(data) {
  //天氣溫度分佈
  const weatherTemperature = document.querySelector(".weatherTemperature");
  weatherTemperature.textContent = `${data.max_temperature}℃`;

  //天氣狀況
  const weatherStatus = document.querySelector(".weatherStatus");
  weatherStatus.textContent = `${data.weather}`;

  //天氣圖樣式呈現
  const weatherIcon = document.querySelector(".weatherIcon");
  weatherIcon.style.backgroundImage = `url(${getWeatherIcon(data.weather)})`;
}

//取得一個禮拜的天氣資訊
async function fetchWeekWeatherForCity(city) {
  try {
    const response = await fetch(
      `/api/week_weather?search=${city}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "There was a problem fetching the week weather data:",
      error.message
    );
  }
}

//渲染一個禮拜天氣畫面
function renderWeekWeather(data) {
  const nextSevenDaysInfo = getNextSevenDays();

  const sevenDaysWeatherInfo = document.querySelector(".sevenDaysWeatherInfo");

  //清除現有元素
  while (sevenDaysWeatherInfo.firstChild) {
    sevenDaysWeatherInfo.removeChild(sevenDaysWeatherInfo.firstChild);
  }

  for (let i = 0; i < 7; i++) {
    const sevenDaysWeatherItem = document.createElement("div");
    sevenDaysWeatherItem.className = "sevenDaysWeatherInfo-item";

    const sevenDaysWeatherDate = document.createElement("div");
    sevenDaysWeatherDate.className = "sevenDaysWeatherInfo-date";
    sevenDaysWeatherDate.textContent = nextSevenDaysInfo[i + 1].day;

    const sevenDaysWeatherIcon = document.createElement("img");
    sevenDaysWeatherIcon.className = "sevenDaysWeatherInfo-item-icon";
    sevenDaysWeatherIcon.src = getWeatherIcon(data.week_weather[i]);

    const sevenDaysWeatherTemperature = document.createElement("div");
    sevenDaysWeatherTemperature.className = "sevenDaysWeatherInfo-temperature";
    sevenDaysWeatherTemperature.textContent = `${data.max_temperature[i]}℃`;

    sevenDaysWeatherItem.appendChild(sevenDaysWeatherDate);
    sevenDaysWeatherItem.appendChild(sevenDaysWeatherIcon);
    sevenDaysWeatherItem.appendChild(sevenDaysWeatherTemperature);

    sevenDaysWeatherInfo.appendChild(sevenDaysWeatherItem);
  }
}

//獲取今天往後算七天的日期資訊
function getNextSevenDays() {
  const days = [];
  const now = new Date();

  for (let i = 0; i < 8; i++) {
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + i);
    days.push(getDateInfo(nextDay));
  }

  return days;
}

//判斷天氣圖案
function getWeatherIcon(weatherDescription) {
  if (weatherDescription.includes("雲") && weatherDescription.includes("晴")) {
    return "/static/image/partly-sunny-outline.svg";
  } else if (weatherDescription.includes("晴")) {
    return "/static/image/sunny-outline.svg";
  } else if (weatherDescription.includes("雨")) {
    return "/static/image/rainy-outline.svg";
  } else {
    return "/static/image/cloud-outline.svg";
  }
}
