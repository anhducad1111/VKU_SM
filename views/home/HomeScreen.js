import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native';
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome5';
import FetchPostScreen from '../posts/FetchPostScreen';
import { getDatabase } from "firebase/database";
import WeatherScreen from '../components/WeatherScreen';

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
            return <FetchPostScreen userId={currentUserUid} pageType="home" />;
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
    headerHome: {
        height: 50,
        backgroundColor: '#808080',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
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
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    postIconHeader: {
        backgroundColor: '#FFFFFF',
        width: 40,
        height: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    blankView: {
        height: 80,
    },
});