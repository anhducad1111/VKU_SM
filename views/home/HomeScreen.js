import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native';
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome5';
import FetchPostScreen from '../posts/FetchPostScreen';
import { getDatabase } from "firebase/database";
import WeatherScreen from '../components/WeatherScreen';
import Header from '../components/Header';

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

    const renderItem = ({ item }) => {
        if (item.type === 'weather') {
            return <WeatherScreen />;
        } else if (item.type === 'posts') {
            return <FetchPostScreen pageType="home" />;
        }
        return null;
    };

    const data = [
        { type: 'weather' },
        { type: 'posts' }
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <Header />
                }
                ListFooterComponent={<View style={styles.blankView} />}
                stickyHeaderIndices={[0]}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    )
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    blankView: {
        height: 80,
    },
});