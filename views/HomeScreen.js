import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Pressable, ScrollView, RefreshControl } from 'react-native';
import firebase, { auth, onAuthStateChanged } from 'firebase/app';
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome5';
import FetchPostScreen from './FetchPostScreen';
import { getDatabase, ref as databaseRef, set, onValue, get, query, orderByChild } from "firebase/database";
import WeatherScreen from './WeatherScreen';


const HomeScreen = ({ navigation }) => {
    const database = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
    const currentUserUid = user.uid;

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // Fetch data again here
        navigation.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
        });
    }
    const [userName, setUserName] = useState('');

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={styles.headerHome}>
                    <View style={styles.textHeader}>
                        <Text style={styles.textAppHeader}>VKU SM</Text>
                    </View>
                    <View style={styles.iconHeader}>
                        <View style={styles.searchIconHeader}>
                            <Pressable onPress={() => navigation.navigate('AddPostScreen')}>
                                <Icon name="plus" color='#000' size={25} />
                            </Pressable>
                        </View>
                        <View style={styles.postIconHeader}>
                            <Pressable onPress={() => navigation.navigate('SearchScreen')}>
                                <Icon name="search" color='#000' size={25} />
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View style={styles.postView}>
                    {/* <WeatherScreen /> */}
                    <FetchPostScreen userId={currentUserUid} pageType="home" />

                </View>
                <View style={styles.blankView}>
                    {/* <Text style={styles.textAppHeader}>VKU SM</Text> */}
                </View>
            </ScrollView>
        </View>
    )
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerHome: {
        height: 70,
        backgroundColor: '#808080',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16
    },
    textHeader: {
        flex: 1,
    },
    textAppHeader: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    iconHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    searchIconHeader: {
        backgroundColor: '#FFFFFF',
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    postIconHeader: {
        backgroundColor: '#FFFFFF',
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    postView: {
        flex: 1,
    },
    blankView: {
        height: 80,
    },
})
