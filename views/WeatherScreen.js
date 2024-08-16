import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import firebase, { auth, onAuthStateChanged } from 'firebase/app';
import { getAuth } from "firebase/auth";
import axios from 'axios';
// import Geolocation from 'react-native-geolocation-service';

const WeatherScreen = ({ navigation }) => {
    // const uid = auth().currentUser.uid;
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const API_KEY = 'dd84794dfcf30d107044cf35a368ec05';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

    useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation(position.coords);
        fetch(`${BASE_URL}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`)
          .then(response => response.json())
          .then(data => {
            setWeather(data);
          })
          .catch(error => {
            console.log(error);
          });
      },
      error => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);


    return (
        <View>
            {/* <View style={styles.container}>
                <Text style={styles.header}>Weather in {weather.name}</Text>
                <View style={styles.content}>
                    <Image
                        style={styles.weatherIcon}
                        source={{
                            uri: `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`,
                        }}
                    />
                    <Text style={styles.temperature}>
                        {Math.round(weather.main.temp)}°C
                    </Text>
                </View>
                <Text style={styles.description}>{weather.weather[0].description}</Text>
            </View> */}
        </View>
    );
};

export default WeatherScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },

})
