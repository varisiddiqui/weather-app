require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public')); // Serve static files from public directory

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
    try {
        const { city } = req.query;
        
        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }

        const apiKey = process.env.API_KEY;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Could not fetch weather data');
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Weather API Error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});