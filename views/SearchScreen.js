import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Pressable } from 'react-native';
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-gesture-handler';
import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";
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
import AddFriendButton from './friends/AddFriendButton';

const SearchScreen = ({ navigation, sentId, receivedId }) => {
    const storage = getStorage();
    const database = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
    const currentUserUid = user.uid;
    const [searchText, setSearchText] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchInputValue, setSearchInputValue] = useState('');

    const handleSearch = async () => {
        const dbRef = databaseRef(database, 'users/');
        const dbquery = query(dbRef, orderByChild('id'), equalTo(searchText));
        onValue(dbquery, (snapshot) => {
            const result = snapshot.val();
            setSearchResult(result);
            setSearchInputValue(searchText); 
        });
    };


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
                        onSubmitEditing={handleSearch} />
                </View>
            </View>
            {searchResult && (
                <View>
                    {Object.values(searchResult).map((user) => (
                        <View key={user.id}>
                            <View style={styles.resultSearch}>
                                <View style={styles.avatarUser}>
                                    <Image style={styles.imageAvatarUser}
                                        source={require('../assets/tempAvatar.jpg')} />
                                    <View style={styles.profile}>
                                        <Text style={styles.nameProfile}>{user.name}</Text>
                                    </View>
                                </View>
                                <View style={styles.buttonProfile}>
                                    <AddFriendButton sentId={currentUserUid} receivedId={searchInputValue} />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    )
};

export default SearchScreen;

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
    nameProfile:{
        color: '#000',
        fontSize: 12,
    }
})