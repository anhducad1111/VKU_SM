import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';

const WeatherScreen = ({ navigation }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = 'dd84794dfcf30d107044cf35a368ec05'; 
  const city = 'Da Nang'; 

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            q: city,
            appid: apiKey,
            units: 'metric' // Đơn vị nhiệt độ: 'metric' cho Celsius hoặc 'imperial' cho Fahrenheit
          }
        });
        setWeather(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  const weatherIcon = weather?.weather[0]?.icon;
  let iconName = 'sun'; 

  switch (weatherIcon) {
    case '01d':
    case '01n':
      iconName = 'sun'; // Trời quang
      break;
    case '02d':
    case '02n':
      iconName = 'cloud-sun'; // Có mây ít
      break;
    case '03d':
    case '03n':
      iconName = 'cloud'; // Mây rải rác
      break;
    case '04d':
    case '04n':
      iconName = 'cloud-meatball'; // Mây dày
      break;
    case '09d':
    case '09n':
      iconName = 'cloud-showers-heavy'; // Mưa
      break;
    case '10d':
    case '10n':
      iconName = 'cloud-sun-rain'; // Mưa nhẹ
      break;
    case '11d':
    case '11n':
      iconName = 'bolt'; // Sấm sét
      break;
    case '13d':
    case '13n':
      iconName = 'snowflake'; // Tuyết
      break;
    case '50d':
    case '50n':
      iconName = 'smog'; // Sương mù
      break;
    default:
      iconName = 'sun'; // Mặc định nếu không có mã icon
  }

  return (
    <View style={styles.container}>
      {weather && (
        <View style={styles.weatherContainer}>
          <Icon name={iconName} size={50} color="#000" />
          <View style={styles.weatherInfo}>
            <Text style={styles.cityName}>{weather.name}</Text>
            <Text>Temperature: {weather.main.temp}°C</Text>
            <Text>Weather: {weather.weather[0].description}</Text>
            <Text>Humidity: {weather.main.humidity}%</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherInfo: {
    marginLeft: 16,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default WeatherScreen;
