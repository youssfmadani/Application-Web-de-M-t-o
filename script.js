const apiKey = 'YOUR_API_KEY'; // Remplacez par votre clé API

document.getElementById('search-btn').addEventListener('click', function() {
    let city = document.getElementById('city-input').value;
    fetchWeather(city);
});

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            fetchForecast(city);
        });
}

function displayWeather(data) {
    document.getElementById('city-name').innerHTML = data.name;
    document.getElementById('current-weather').innerHTML = `
        <h2>${data.weather[0].main}</h2>
        <p>${data.main.temp}°C</p>
    `;
}

function fetchForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        });
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';
    data.list.slice(0, 5).forEach((forecast, index) => {
        const weatherItem = document.createElement('div');
        weatherItem.classList.add('weather-item');
        weatherItem.innerHTML = `
            <h3>Day ${index + 1}</h3>
            <p class="temp">${forecast.main.temp}°C</p>
            <p>${forecast.weather[0].main}</p>
        `;
        forecastDiv.appendChild(weatherItem);
    });
}
function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';
    data.list.filter((forecast, index) => index % 8 === 0).forEach((forecast, index) => {
        const weatherItem = document.createElement('div');
        weatherItem.classList.add('weather-item');
        weatherItem.innerHTML = `
            <h3>Day ${index + 1}</h3>
            <p class="temp">${forecast.main.temp}°C</p>
            <p>${forecast.weather[0].main}</p>
        `;
        forecastDiv.appendChild(weatherItem);
    });
}
function fetchWeather(city) {
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                alert("City not found. Please try again.");
            } else {
                displayWeather(data);
                fetchForecast(city);
            }
        })
        .catch(error => alert("Error fetching weather data"));
}

