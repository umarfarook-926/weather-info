const express = require('express');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Weather API');
});

app.get('/weather', async (req, res) => {
    const city = req.query.city ;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather`;

    try {
        const response = await axios.get(apiUrl, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.get('/forecast', async (req, res) => {
    const city = req.query.city;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast`;

    try {
        const response = await axios.get(apiUrl, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        res.status(500).json({ error: 'Error fetching forecast data' });
    }
});

app.get('/air_pollution', async (req, res) => {
    const city = req.query.city;
    const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct`;

    try {
        // First, get the latitude and longitude of the city
        const geoResponse = await axios.get(geocodingUrl, {
            params: {
                q: city,
                appid: API_KEY
            }
        });

        const geoData = geoResponse.data[0];
        const { lat, lon } = geoData;

        // Then, get the air pollution data using the latitude and longitude
        const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution`;
        const response = await axios.get(apiUrl, {
            params: {
                lat: lat,
                lon: lon,
                appid: API_KEY
            }
        });

        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error('Error fetching air pollution data:', error);
        res.status(500).json({ error: 'Error fetching air pollution data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
