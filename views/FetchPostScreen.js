import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getDatabase, ref as databaseRef, set, onValue, orderByChild, orderByKey, get, query } from 'firebase/database';
import moment from 'moment';
import 'moment/locale/vi'


const FetchPostScreen = ({ navigation, userId, pageType }) => {
    const auth = getAuth();
    // const currentUserUid = auth.currentUser?.uid;
    // const currentUser = auth.currentUser;
    const [userName, setUserName] = useState('');
    const database = getDatabase();


    useEffect(() => {
        if (userId) {
            const userRef = databaseRef(database, `users/${userId}`);
            onValue(userRef, (snapshot) => {
                const userData = snapshot.val();
                const userName = userData?.name;
                setUserName(userName);
            });
        }
    }, [userId]);

    const [posts, setPosts] = useState([]);


    if (pageType === 'home') {
        useEffect(() => {
            const postRef = databaseRef(database, 'posts');
            const postQuery = query(postRef, orderByChild('timestamp'));
            get(postQuery).then((snapshot) => {
                const postList = [];

                snapshot.forEach((userSnapshot) => {
                    const userIdPost = userSnapshot.key;

                    userSnapshot.forEach((postSnapshot) => {
                        const postId = postSnapshot.key;
                        const post = postSnapshot.val();

                        postList.push({
                            userIdPost: userIdPost,
                            id: postId,
                            postText: post.postText,
                            privacy: post.privacy,
                            postImg: post.postImg,
                            likes: post.likes,
                            comments: post.comments,
                            timestamp: post.timestamp,
                            userPostAdd: post.userPostAdd,
                        });
                    });
                });

                const reversedPostList = postList.reverse();
                setPosts(reversedPostList);
            });
        }, []);
    } else if (pageType === 'personal') {
        useEffect(() => {
            const postRef = databaseRef(database, `posts/${userId}`);
            const postQuery = query(postRef, orderByChild('timestamp'));
            get(postQuery).then((snapshot) => {
                const postList = [];

                snapshot.forEach((childSnapshot) => {
                    const postId = childSnapshot.key;
                    const post = childSnapshot.val();

                    postList.push({
                        userIdPost: userId,
                        id: postId,
                        postText: post.postText,
                        privacy: post.privacy,
                        postImg: post.postImg,
                        likes: post.likes,
                        comments: post.comments,
                        timestamp: post.timestamp,
                        userPostAdd: post.userPostAdd,
                    });
                });

                const reversedPostList = postList.reverse();
                setPosts(reversedPostList);
            });
        }, [userId]);
    }

    
    return (
        <View>
            <ScrollView>
                {posts.map((post) => (

                    <View style={styles.container} key={post.id}>
                        <View style={styles.postContainer}>
                            <View style={styles.postHeader}>
                                <View style={styles.postHeaderLeft}>
                                    <View style={styles.avatarContainer}>
                                        <Image
                                            style={styles.avatar}
                                            source={require("../assets/tempAvatar.jpg")}
                                        />
                                    </View>
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName}>{post.userPostAdd}</Text>
                                        <Text style={styles.time}>{moment(post.timestamp).locale('en').fromNow()}</Text>
                                    </View>
                                </View>
                                <View style={styles.postHeaderRight}>
                                    <Icon
                                        style={styles.iconTop}
                                        name="ellipsis-h"
                                        color="#000"
                                        size={25}
                                    />
                                </View>
                            </View>
                            <View style={styles.postContent}>
                                <Text style={styles.postText}>{post.postText}</Text>
                                {post.postImg && (
                                    <Image
                                        style={styles.postImage}
                                        source={{ uri: post.postImg }}
                                    />
                                )}
                            </View>
                            <View style={styles.postFooter}>
                                {/* <View style={styles.iconGroupLeft}>
                                    
                                </View> */}
                                <Icon
                                    style={styles.iconContainer}
                                    name="heart"
                                    color="#000"
                                    size={25}
                                />
                                <Icon
                                    style={styles.iconContainer}
                                    name="comment"
                                    color="#000"
                                    size={25}
                                />
                                <Icon
                                    style={styles.iconContainer}
                                    name="share"
                                    color="#000"
                                    size={25}
                                />
                                <Icon style={styles.iconRight}
                                    name="bookmark" color="#000" size={25} />
                                {/* <View style={styles.iconGroupRight}>
                                    
                                </View> */}
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

export default FetchPostScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 20,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },
    postHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 10,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
    userInfo: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    time: {
        fontSize: 12,
        color: '#666',
    },
    postHeaderRight: {
        alignItems: 'flex-end',
    },
    postText: {
        fontSize: 16,
        lineHeight: 20,
        margin: 10,
        color: '#666',
    },
    postImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 20,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 5,
    },
    iconGroupLeft: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    iconGroupRight: {
        flexDirection: 'row',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginRight: 50,
    },
    iconRight: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
})