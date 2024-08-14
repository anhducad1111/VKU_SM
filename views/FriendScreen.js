import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import firebase, { auth, onAuthStateChanged } from 'firebase/app';
import { getAuth } from "firebase/auth";

const FriendScreen = ({ navigation }) => {
    // const uid = auth().currentUser.uid;
    const auth = getAuth();
    const user = auth.currentUser.uid;
    return (
        <View >
            <Text>{user}</Text>
        </View>
    )
};

export default FriendScreen;