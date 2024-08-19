import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const SettingScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.headerText, isDarkMode ? styles.darkText : styles.lightText]}>Settings</Text>
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, isDarkMode ? styles.darkText : styles.lightText]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleSwitch}
          thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 16,
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingText: {
    fontSize: 18,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  lightButton: {
    backgroundColor: '#007BFF',
  },
  darkButton: {
    backgroundColor: '#444',
  },
  buttonText: {
    fontSize: 18,
    marginRight: 8,
  },
  lightButtonText: {
    color: '#fff',
  },
  darkButtonText: {
    color: '#fff',
  },
});

export default SettingScreen;
