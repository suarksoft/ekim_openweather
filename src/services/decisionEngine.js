const WeatherService = require('./weatherService');

class DecisionEngine {
  static makeDecision(weatherData) {
    const current = weatherData.current;
    const forecast = weatherData.forecast;

    // Mevcut sıcaklık ve koşullar
    const currentTemp = current.main.temp;
    const currentWindSpeed = current.wind?.speed || 0; // m/s
    const currentRain = current.weather[0].main.toLowerCase().includes('rain') || 
                        current.weather[0].main.toLowerCase().includes('drizzle');
    const currentSnow = current.weather[0].main.toLowerCase().includes('snow');

    // Önümüzdeki 24-48 saat içinde yağış kontrolü
    let hasRainForecast = false;
    let maxRainProbability = 0;
    
    if (forecast && forecast.list) {
      // İlk 12 saat içindeki tahminleri kontrol et (48 saat için yaklaşık ilk 16 item)
      const relevantForecasts = forecast.list.slice(0, 16);
      
      for (const item of relevantForecasts) {
        const isRain = item.weather[0].main.toLowerCase().includes('rain') ||
                      item.weather[0].main.toLowerCase().includes('drizzle') ||
                      item.weather[0].main.toLowerCase().includes('thunderstorm');
        
        if (isRain) {
          hasRainForecast = true;
        }
        
        if (item.rain && item.rain['3h']) {
          maxRainProbability = Math.max(maxRainProbability, item.rain['3h']);
        }
        
        if (item.pop) { // Probability of precipitation
          maxRainProbability = Math.max(maxRainProbability, item.pop * 100);
        }
      }
    }

    // Karar kuralları
    let decisionStatus = 'UYGUN';
    let reason = '';

    // 1. Yağış kontrolü (en önemli)
    if (currentRain || currentSnow || hasRainForecast || maxRainProbability > 50) {
      decisionStatus = 'UYGUN_DEGIL';
      reason = 'Önümüzdeki 24-48 saat içinde yağış bekleniyor. Ekim işlemi için uygun değil.';
      return { decisionStatus, reason };
    }

    // 2. Rüzgar kontrolü
    if (currentWindSpeed > 12) {
      decisionStatus = 'UYARI';
      reason = `Yüksek rüzgar hızı (${currentWindSpeed.toFixed(1)} m/s) tespit edildi. İlaçlama ve sera işleri için dikkatli olunmalı. Ekim işlemi yapılabilir ancak dikkatli olunmalı.`;
      return { decisionStatus, reason };
    }

    // 3. Sıcaklık kontrolü
    if (currentTemp < 15) {
      decisionStatus = 'UYARI';
      reason = `Sıcaklık düşük (${currentTemp.toFixed(1)}°C). Bazı ürünler için ekim için ideal sıcaklık değil. Daha sıcak günler beklenebilir.`;
      return { decisionStatus, reason };
    }

    if (currentTemp > 30) {
      decisionStatus = 'UYARI';
      reason = `Sıcaklık yüksek (${currentTemp.toFixed(1)}°C). Ekim yapılabilir ancak sulama programına dikkat edilmelidir.`;
      return { decisionStatus, reason };
    }

    // 4. İdeal koşullar
    if (currentTemp >= 15 && currentTemp <= 30 && currentWindSpeed <= 12) {
      decisionStatus = 'UYGUN';
      reason = `Sıcaklık (${currentTemp.toFixed(1)}°C) ve rüzgar koşulları ekim için uygun. Yağış beklenmiyor. Ekim işlemine başlanabilir.`;
      return { decisionStatus, reason };
    }

    // Varsayılan
    decisionStatus = 'UYGUN';
    reason = 'Hava koşulları genel olarak ekim için uygun görünüyor.';
    
    return { decisionStatus, reason };
  }

  static async generateDecision(farmId, cropType, farmCity, farmDistrict, date = null) {
    try {
      // Hava durumu verilerini çek
      const weatherData = await WeatherService.getWeatherData(farmCity, farmDistrict);
      
      // Karar üret
      const { decisionStatus, reason } = this.makeDecision(weatherData);
      
      // Weather snapshot (sadece gerekli bilgileri sakla)
      const weatherSnapshot = {
        current: {
          temp: weatherData.current.main.temp,
          humidity: weatherData.current.main.humidity,
          pressure: weatherData.current.main.pressure,
          windSpeed: weatherData.current.wind?.speed || 0,
          windDeg: weatherData.current.wind?.deg || 0,
          weather: weatherData.current.weather[0].main,
          description: weatherData.current.weather[0].description,
          location: weatherData.current.name
        },
        timestamp: new Date().toISOString()
      };

      return {
        farm_id: farmId,
        crop_type: cropType,
        decision_status: decisionStatus,
        reason,
        weather_snapshot_json: weatherSnapshot
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DecisionEngine;

