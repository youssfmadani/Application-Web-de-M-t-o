const apiKey = "07d05b7536c6cd0877e496a495b8ef12"; // Replace with your OpenWeatherMap API key
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherIcon = document.getElementById("weather-icon");
const dayTemp = document.getElementById("day-temp");
const nightTemp = document.getElementById("night-temp");
const weatherForecast = document.getElementById("weather-forecast");
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const timeZone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const additionalInfo = document.getElementById("additional-info");

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function updateTimeAndDate() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    timeEl.textContent = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
    dateEl.textContent = now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

async function fetchWeatherByCoords(lat, lon) {
    const response = await fetch(`${weatherUrl}lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const data = await response.json();
    displayWeather(data);
    fetchForecastByCoords(lat, lon);
}

async function fetchWeatherByCity(city) {
    const response = await fetch(`${weatherUrl}q=${city}&appid=${apiKey}`);
    const data = await response.json();
    displayWeather(data);
    fetchForecastByCity(city);
}

async function fetchForecastByCoords(lat, lon) {
    const response = await fetch(`${forecastUrl}lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const data = await response.json();
    displayForecast(data);
}

async function fetchForecastByCity(city) {
    const response = await fetch(`${forecastUrl}q=${city}&appid=${apiKey}`);
    const data = await response.json();
    displayForecast(data);
}

function displayWeather(data) {
    const temp = Math.round(data.main.temp); // Current temperature
    const feelsLike = Math.round(data.main.feels_like); // Feels-like temperature
    const cityName = data.name; // City name
    const countryCode = data.sys.country; // Country code
    const windSpeed = data.wind.speed; // Wind speed in m/s
    const humidity = data.main.humidity; // Humidity in percentage
    const weatherDescription = data.weather[0].description; // Weather description
    const pressure = data.main.pressure; // Atmospheric pressure in hPa
    const visibility = data.visibility / 1000; // Visibility in km (convert from meters)
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString(); // Sunrise time
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString(); // Sunset time

    // Air quality data (for OpenWeatherMap's Air Pollution API)
    const airQuality = data.air_quality ? data.air_quality.aqi : "N/A"; // Assuming air quality data is available

    // Dew point (can be calculated from other data if needed, using approximation formula)
    const dewPoint = data.main.dew_point ? Math.round(data.main.dew_point) : "N/A"; 

    // UV Index (UV data may require a separate API call for UV index)
    const uvIndex = data.uvi ? data.uvi : "N/A"; // Assuming UV index is available

    // Update UI elements with weather details
    timeZone.textContent = `${cityName}, ${countryCode}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    dayTemp.textContent = `Day: ${temp}°C`;
    nightTemp.textContent = `Feels Like: ${feelsLike}°C`;
    countryEl.textContent = countryCode;

    // Additional weather details
    additionalInfo.innerHTML = `
        <p><strong>Description:</strong> ${weatherDescription}</p>
        <p><strong>Wind Speed:</strong> ${windSpeed} km/h</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Pressure:</strong> ${pressure} hPa</p>
        <p><strong>Visibility:</strong> ${visibility} km</p>
        <p><strong>Sunrise:</strong> ${sunrise}</p>
        <p><strong>Sunset:</strong> ${sunset}</p>
        <p><strong>Air Quality (AQI):</strong> ${airQuality}</p>
        <p><strong>UV Index:</strong> ${uvIndex}</p>
        <p><strong>Dew Point:</strong> ${dewPoint}°C</p>
    `;
}

function displayForecast(data) {
    weatherForecast.innerHTML = "";
    const todayIndex = new Date().getDay();

    // Filter forecasts for approximately 12 PM each day
    const forecasts = data.list.filter(f => f.dt_txt.includes("12:00:00"));
    forecasts.slice(0, 5).forEach((forecast, index) => {
        const forecastDayIndex = (todayIndex + index + 1) % 7; // Start from the next day
        const day = DAYS[forecastDayIndex];
        const temp = Math.round(forecast.main.temp);
        const icon = forecast.weather[0].icon;

        weatherForecast.innerHTML += `
            <div class="weather-forecast-item">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" class="w-icon" />
                <div class="day">${day}</div>
                <div class="temp">${temp}°C</div>
            </div>
        `;
    });
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            error => {
                alert("Unable to retrieve your location. Please search manually.");
                fetchWeatherByCity("Casablanca"); // Default to Casablanca if location access is denied
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
        fetchWeatherByCity("Casablanca"); // Default to Casablanca if Geolocation API is unavailable
    }
}

// Event listeners
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeatherByCity(city);
});

// Automatically fetch weather for user's location on page load
window.addEventListener("load", () => {
    getUserLocation();
    updateTimeAndDate();
    setInterval(updateTimeAndDate, 1000); // Update time every second
});
