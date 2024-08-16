import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { getAuth, signOut  } from "firebase/auth";
import { getDatabase, ref as databaseRef, get } from "firebase/database";
import FetchPostScreen from "../posts/FetchPostScreen";
import DropdownMenu from "../components/DropDownMenu";

const SettingScreen = ({ navigation }) => {

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    navigation.reset({
      index: 0,
      routes: [{ name: "SettingScreen" }],
    });
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  
});
