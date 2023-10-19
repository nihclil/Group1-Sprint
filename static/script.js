console.log("This is the start of our Sprint");
const loader = document.querySelector(".loader")

document.addEventListener("DOMContentLoaded", async function () {
  //顯示時間畫面渲染
  renderDateAndWeekday();
  //先載入臺中市天氣
  try {
    const defaultCity = "臺中市";

    let promiseToday = fetchTodayWeatherForCity(defaultCity)
    let promiseWeek = fetchWeekWeatherForCity(defaultCity)

    Promise.all([promiseToday, promiseWeek])
      .then( datas => {
        let [ today, week ] = datas
        renderTodayWeather(today);
        renderWeekWeather(week);
      })

  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
  //監聽下拉式選單，處理後續畫面呈現
  const dropDownList = document.getElementById("selectedCity");
  dropDownList.addEventListener("change", async function () {
    const cityNameValue = dropDownList.value;

    if (cityNameValue) {
      try {
        let promiseToday = fetchTodayWeatherForCity(cityNameValue)
        let promiseWeek = fetchWeekWeatherForCity(cityNameValue)
        Promise.all([promiseToday, promiseWeek])
          .then( datas => {
            let [ today, week ] = datas
            renderTodayWeather(today);
            renderWeekWeather(week);
          })
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

  return fetch(`/api/today_weather?search=${city}`)
    .then( response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json()
    })
    .catch((e)=>{
      console.error(
        "There was a problem fetching the today weather data:",
        error.message
      );
    })
  // try {
  //   const response = await fetch(`/api/today_weather?search=${city}`);
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error(
  //     "There was a problem fetching the today weather data:",
  //     error.message
  //   );
  // }
}

//渲染當天天氣畫面
function renderTodayWeather(data) {
  const weatherTemperature = document.querySelector(".weatherTemperature");
  const weatherStatus = document.querySelector(".weatherStatus");
  const weatherIcon = document.querySelector(".weatherIcon");

  weatherTemperature.classList.add("fade-out");
  weatherStatus.classList.add("fade-out");
  weatherIcon.classList.add("fade-out");

  setTimeout(() => {
    weatherStatus.textContent = `${data.weather}`;
    weatherTemperature.textContent = `${data.max_temperature}℃`;
    weatherIcon.style.backgroundImage = `url(${getWeatherIcon(data.weather)})`;

    weatherTemperature.classList.remove("fade-out");
    weatherStatus.classList.remove("fade-out");
    weatherIcon.classList.remove("fade-out");

    setTimeout(() => {
      weatherTemperature.classList.add("fade-in");
      weatherStatus.classList.add("fade-in");
      weatherIcon.classList.add("fade-in");
    }, 50);
  }, 300);
}

//取得一個禮拜的天氣資訊
async function fetchWeekWeatherForCity(city) {
  return fetch(`/api/week_weather?search=${city}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json()
    })
    .catch((error)=>{
      console.error(
            "There was a problem fetching the week weather data:",
            error.message
          );
    })
  // try {
  //   const response = await fetch(`/api/week_weather?search=${city}`);
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error(
  //     "There was a problem fetching the week weather data:",
  //     error.message
  //   );
  // }
}

//渲染一個禮拜天氣畫面
function renderWeekWeather(data) {
  const nextSevenDaysInfo = getNextSevenDays();

  const sevenDaysWeatherInfo = document.querySelector(".sevenDaysWeatherInfo");
  //淡出效果

  //清除現有元素
  setTimeout(() => {
    while (sevenDaysWeatherInfo.firstChild) {
      sevenDaysWeatherInfo.removeChild(sevenDaysWeatherInfo.firstChild);
    }
    sevenDaysWeatherInfo.classList.remove("fade-in");

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
      sevenDaysWeatherTemperature.className =
        "sevenDaysWeatherInfo-temperature";
      sevenDaysWeatherTemperature.textContent = `${data.max_temperature[i]}℃`;

      sevenDaysWeatherItem.appendChild(sevenDaysWeatherDate);
      sevenDaysWeatherItem.appendChild(sevenDaysWeatherIcon);
      sevenDaysWeatherItem.appendChild(sevenDaysWeatherTemperature);

      sevenDaysWeatherInfo.appendChild(sevenDaysWeatherItem);
    }

    setTimeout(() => {
      sevenDaysWeatherInfo.classList.add("fade-in");
    }, 50);
  }, 300);
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
