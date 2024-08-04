document.getElementById('weather-form').addEventListener('click', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    fetchWeather(city);
});

document.getElementById('get-forecast').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    fetchForecast(city);
});

document.getElementById('get-air-pollution').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    fetchAirPollution(city);
});

function fetchWeather(city) {
    fetch(`/weather?city=${encodeURIComponent(city)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const weatherInfo = formatWeatherInfo(data);
            document.getElementById('weather-info').innerHTML = weatherInfo;
            document.getElementById('weather-info').style.display = 'block';
            document.getElementById('forecast-info').style.display = 'none';
            document.getElementById('air-pollution-info').style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerHTML = '<p>Error fetching weather data. Please try again.</p>';
        });
}

function fetchForecast(city) {
    fetch(`/forecast?city=${encodeURIComponent(city)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const forecastInfo = formatForecastInfo(data);
            document.getElementById('forecast-info').innerHTML = forecastInfo;
            document.getElementById('weather-info').style.display = 'none';
            document.getElementById('forecast-info').style.display = 'block';
            document.getElementById('air-pollution-info').style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            document.getElementById('forecast-info').innerHTML = '<p>Error fetching forecast data. Please try again.</p>';
        });
}

function fetchAirPollution(city) {
    fetch(`/air_pollution?city=${encodeURIComponent(city)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const airPollutionInfo = formatAirPollutionInfo(data);
            document.getElementById('air-pollution-info').innerHTML = airPollutionInfo;
            document.getElementById('weather-info').style.display = 'none';
            document.getElementById('forecast-info').style.display = 'none';
            document.getElementById('air-pollution-info').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching air pollution data:', error);
            document.getElementById('air-pollution-info').innerHTML = '<p>Error fetching air pollution data. Please try again.</p>';
        });
}

function formatWeatherInfo(data) {
    const cityName = data.name;
    const country = data.sys.country;
    const description = data.weather[0].description;
    const temperature = data.main.temp;
    const feelsLike = data.main.feels_like;
    const minTemp = data.main.temp_min;
    const maxTemp = data.main.temp_max;
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const visibility = data.visibility;
    const windSpeed = data.wind.speed;
    const windDirection = data.wind.deg;
    const windGust = data.wind.gust || 'N/A';
    const cloudiness = data.clouds.all;
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    return `
        <h2>Weather in ${cityName}, ${country}</h2>
        <p>Description: ${description}</p>
        <p>Temperature: ${temperature}°C (Feels like ${feelsLike}°C)</p>
        <p>Min Temperature: ${minTemp}°C | Max Temperature: ${maxTemp}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Pressure: ${pressure} hPa</p>
        <p>Visibility: ${visibility} meters</p>
        <p>Wind: ${windSpeed} m/s, Direction ${windDirection}°, Gust ${windGust} m/s</p>
        <p>Cloudiness: ${cloudiness}%</p>
        <p>Sunrise: ${sunriseTime}</p>
        <p>Sunset: ${sunsetTime}</p>
    `;
}

function formatForecastInfo(data) {
    return `
        <h2>5-Day Forecast</h2>
        <ul>
            ${data.list.map(forecast => {
                const dateTime = new Date(forecast.dt_txt);
                const temperature = forecast.main.temp;
                const description = forecast.weather[0].description;

                return `
                    <li>
                        <p>Date/Time: ${dateTime.toLocaleString()} </p>
                        <p>Temperature: ${temperature}°C </p>
                        <p>Description: ${description}</p>
                    </li>
                `;
            }).join('')}
        </ul>
    `;
}

function formatAirPollutionInfo(data) {
    const aqi = data.list[0].main.aqi;
    const components = data.list[0].components;

    return `
        <h2>Air Pollution Data</h2>
        <p>Air Quality Index (AQI): ${aqi}</p>
        <p>Components:</p>
        <ul>
            <li>CO: ${components.co} µg/m³</li>
            <li>NO: ${components.no} µg/m³</li>
            <li>NO₂: ${components.no2} µg/m³</li>
            <li>O₃: ${components.o3} µg/m³</li>
            <li>SO₂: ${components.so2} µg/m³</li>
            <li>PM₂.₅: ${components.pm2_5} µg/m³</li>
            <li>PM₁₀: ${components.pm10} µg/m³</li>
            <li>NH₃: ${components.nh3} µg/m³</li>
        </ul>
    `;
}
