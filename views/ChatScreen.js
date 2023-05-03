import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Pressable, ScrollView, RefreshControl } from 'react-native';
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-gesture-handler';
import {
    getDatabase,
    ref as databaseRef,
    set,
    onValue,
    orderByChild,
    equalTo,
    query,
    get
} from "firebase/database";

const ChatScreen = ({ navigation, sentId, receivedId }) => {
    const database = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
    const currentUserUid = user.uid;
    const [searchText, setSearchText] = useState('');
    const [pairList, setPairList] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        if (!currentUserUid) return;

        const pairRef = databaseRef(database, 'pair');
        const pairQuery = query(pairRef, orderByChild('sentId'), equalTo(currentUserUid));

        get(pairQuery).then((snapshot) => {
            const userList = [];

            snapshot.forEach((childSnapshot) => {
                const pairId = childSnapshot.key;
                const pair = childSnapshot.val();

                if (pair.status === 3) {
                    // Get the user object whose ID matches the receivedId
                    const userId = pair.receivedId
                    const userRef = databaseRef(database, `users/${userId}`);
                    get(userRef).then((userSnapshot) => {
                        if (userSnapshot.exists()) {
                            const user = userSnapshot.val();
                            userList.push({
                                id: pairId,
                                receivedId: pair.receivedId,
                                sentId: pair.sentId,
                                status: pair.status,
                                name: user.name
                            });
                        }
                        if (userList.length === snapshot.size) {
                            setPairList(userList);
                        }
                    });
                }
            });
        });
    }, [currentUserUid]);
    const [refreshing, setRefreshing] = useState(false);


    const onRefresh = () => {
        setRefreshing(true);
        // Fetch data again here
        navigation.reset({
            index: 0,
            routes: [{ name: 'ChatScreen' }],
        });
        console.log(currentUserUid)
    }

    return (
        <View style={styles.container}>

            <View style={styles.headerSearch}>
                <View style={styles.headerSearchLeft}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" color='#000' size={25} />
                    </Pressable>
                </View>
                <View style={styles.headerText}>
                    <TextInput style={styles.headerTextInput}
                        placeholder="Enter user ID"
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
                </View>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View>
                    {pairList.map((pair) => (
                        <View key={pair.id}>
                            <Pressable style={styles.resultSearch}  
                            onPress={() => navigation.navigate('PrivateChatScreen', 
                            { receivedId: pair.receivedId })}>
                                <View style={styles.avatarUser}>
                                    <Image style={styles.imageAvatarUser} source={require('../assets/tempAvatar.jpg')} />
                                    <View style={styles.profile}>
                                        <Text style={styles.nameProfile}>{pair.name}, {pair.receivedId}</Text>
                                    </View>
                                </View>
                                <View style={styles.buttonProfile}>
                                </View>
                            </Pressable>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </View>
    )
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSearch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
    },
    headerSearchLeft: {
        width: 40,
    },
    headerText: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    headerTextInput: {
        height: 40,
        borderRadius: 10,
        backgroundColor: '#DCDCDC',
        paddingHorizontal: 10,
        color: '#000000',
    },
    resultSearch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarUser: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    imageAvatarUser: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
    profile: {
        marginLeft: 10,
    },
    editButtonEditProfile: {
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        marginHorizontal: 10,
    },
    nameProfile: {
        color: '#000',
        fontSize: 12,
    }
})