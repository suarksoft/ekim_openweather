const axios = require('axios');

class WeatherService {
  static async getWeatherData(city, district = null) {
    try {
      const query = district ? `${city},${district},TR` : `${city},TR`;
      const apiKey = process.env.WEATHER_API_KEY;
      const baseUrl = process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';
      
      // Current weather and forecast (5-day)
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(`${baseUrl}/weather`, {
          params: {
            q: query,
            appid: apiKey,
            units: 'metric',
            lang: 'tr'
          }
        }),
        axios.get(`${baseUrl}/forecast`, {
          params: {
            q: query,
            appid: apiKey,
            units: 'metric',
            lang: 'tr'
          }
        })
      ]);

      return {
        current: currentResponse.data,
        forecast: forecastResponse.data
      };
    } catch (error) {
      console.error('Weather API Error:', error.response?.data || error.message);
      throw new Error('Hava durumu verisi alınamadı. Lütfen şehir adını kontrol edin.');
    }
  }

  static async getWeatherDataByCoords(lat, lon) {
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const baseUrl = process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';
      
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(`${baseUrl}/weather`, {
          params: {
            lat,
            lon,
            appid: apiKey,
            units: 'metric',
            lang: 'tr'
          }
        }),
        axios.get(`${baseUrl}/forecast`, {
          params: {
            lat,
            lon,
            appid: apiKey,
            units: 'metric',
            lang: 'tr'
          }
        })
      ]);

      return {
        current: currentResponse.data,
        forecast: forecastResponse.data
      };
    } catch (error) {
      console.error('Weather API Error:', error.response?.data || error.message);
      throw new Error('Hava durumu verisi alınamadı.');
    }
  }
}

module.exports = WeatherService;

