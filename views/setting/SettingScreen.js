import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, ScrollView, Pressable, RefreshControl } from 'react-native';
import firebase, { auth, onAuthStateChanged } from 'firebase/app';
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getDatabase, ref as databaseRef, set, onValue, get, query, orderByChild } from "firebase/database";
import FetchPostScreen from '../posts/FetchPostScreen';


const SettingScreen = ({ navigation }) => {
    const database = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
    const currentUserUid = user.uid;
    const [userName, setUserName] = useState('');
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const postRef = databaseRef(database, `posts/${currentUserUid}`);
        const postQuery = query(postRef, orderByChild('timestamp'));

        get(postQuery).then((snapshot) => {
            const postList = [];

            snapshot.forEach((childSnapshot) => {
                const postId = childSnapshot.key;
                const post = childSnapshot.val();

                postList.push({
                    postText: post.postText,
                    privacy: post.privacy,
                    postImg: post.postImg,
                    likes: post.likes,
                    comments: post.comments,
                    timestamp: post.timestamp,
                });
            });

            setPosts(postList);
        });
    }, [currentUserUid]);

    useEffect(() => {
        const userRef = databaseRef(database, 'users/' + currentUserUid);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            const userName = userData.name;
            setUserName(userName);
        });
    }, []);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // Fetch data again here
        navigation.reset({
            index: 0,
            routes: [{ name: 'SettingScreen' }],
        });
    }
    
    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={styles.headerProfile}>
                    <Pressable style={styles.buttonHeaderProfile}>
                        <Icon name="arrow-left" color='#000' size={25} />
                    </Pressable>
                </View>
                <View style={styles.infoProfile}>
                    <View style={styles.avatarUser}>
                        <Image style={styles.imageAvatarUser}
                            source={require('../../assets/tempAvatar.jpg')} />
                    </View>
                    <View style={styles.fetchProfile}>
                        <View style={styles.nameBioProfile}>
                            <View style={styles.profile}>
                                <Text style={styles.nameProfile}>{userName}</Text>
                                <Pressable style={styles.editButtonEditProfile}>
                                    <Text style={styles.textButtonEditProfile}>Edit Profile</Text>
                                </Pressable>
                            </View>
                            <Text style={styles.bioProfile}>Hello cac b</Text>
                        </View>
                        <View style={styles.numberProfile}>
                            <View style={styles.numberPostProfile}>
                                <Text style={styles.postProfile}>Posts</Text>
                                <Text style={styles.numberPost}>{posts.length}</Text>
                            </View>
                            <View style={styles.numberFriendProfile}>
                                <Text style={styles.friendProfile}>Friends</Text>
                                <Text style={styles.numberFriend}>3</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.postFetchProfile}>
                    <FetchPostScreen userId={currentUserUid} pageType="personal"/>
                </View>
                <View style={styles.blank}>
                </View>
            </ScrollView>
        </View>
    )
};

export default SettingScreen;

const styles = StyleSheet.create({
    headerProfile: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 70,
        backgroundColor: '#fff',
        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
    },
    buttonHeaderProfile: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoProfile: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 5,
        paddingHorizontal: 20,
    },
    avatarUser: {
        marginRight: 15,
    },
    imageAvatarUser: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    fetchProfile: {
        flex: 1,
    },
    nameBioProfile: {
        marginBottom: 10,
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nameProfile: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
    },
    viewButtonEditProfile: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: 5,
    },
    editButtonEditProfile: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
    },
    textButtonEditProfile: {
        fontSize: 14,
        color: '#000',
    },
    bioProfile: {
        color: '#666',
        // marginBottom: 10,
    },
    numberProfile: {
        flexDirection: 'row',
        // justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
        marginTop: 10,
    },
    numberPostProfile: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    postProfile: {
        color: '#8e8e8e',
    },
    numberPost: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#666',
    },
    numberFriendProfile: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    friendProfile: {
        color: '#8e8e8e',
    },
    numberFriend: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#666',
    },
    blank: {
        height: 70,
    }
});