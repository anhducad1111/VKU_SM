import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Pressable, Image, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import firebase, { auth, onAuthStateChanged } from 'firebase/app';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as databaseRef, set, onValue, orderByChild, orderByKey, get, query } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { getAuth } from "firebase/auth";

const ChatContainerView = ({ navigation, receivedId }) => {

    const storage = getStorage();
    const auth = getAuth();
    const database = getDatabase();
    const currentUserUid = auth.currentUser.uid;
    // const receivedId = receivedId ;
    const [userReceivedName, setUserReceivedName] = useState('')
    const [refreshing, setRefreshing] = useState(false);
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState([]);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const pairRef = databaseRef(database, `message/${currentUserUid}-${receivedId}`);
        const pairQuery = query(pairRef, orderByChild('timestamp'));
    
        const unsubscribe = onValue(pairQuery, (snapshot) => {
            const pairList = [];
    
            snapshot.forEach((childSnapshot) => {
                const messageId = childSnapshot.key;
                const message = childSnapshot.val();
    
                pairList.push({
                    id: messageId,
                    messageText: message.messageText,
                    messageImg: message.messageImg,
                    likes: message.likes,
                    sentId: message.sentId,
                    receivedId: message.receivedId,
                    timestamp: message.timestamp,
                });
            });
            setMessage(pairList);
        });
    
        // Hủy đăng ký lắng nghe khi component bị unmount
        return () => unsubscribe();
    }, [currentUserUid, receivedId]);
    

    return (
        <View style={styles.privateChatContainer}>
            {message.map((msg, index) => (
                <View key={index} style={msg.sentId === currentUserUid ? styles.chatRight : styles.chatLeft}>
                    <Image style={styles.imageAvatarUser} source={require('../../assets/tempAvatar.jpg')} />
                    <View style={styles.message}>
                        {msg.messageImg && (
                            <Image
                                style={msg.sentId === currentUserUid ? styles.imgRight : styles.imgLeft}
                                source={{ uri: msg.messageImg }}
                            />
                        )}
                        <View style={msg.sentId === currentUserUid ? styles.viewChatRight : styles.viewChatLeft}>
                            <Text style={msg.sentId === currentUserUid ? styles.textChatRight : styles.textChatLeft}>{msg.messageText}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    )
};

export default ChatContainerView;

const styles = StyleSheet.create({
    privateChatContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    chatLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    chatRight: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 10,
    },
    imageAvatarUser: {
        width: 30,
        height: 30,
        borderRadius: 50,
        marginHorizontal: 10,
    },
    message: {
        
    },
    viewChatRight:{
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row-reverse',
        
    },
    viewChatLeft:{
        flex: 1,
        flexWrap: 'wrap',
    },
    imgLeft: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 5,
    },
    imgRight: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 5,
    },
    textChatLeft: {
        backgroundColor: '#EDEDED',
        padding: 10,
        borderRadius: 10,
        fontSize: 16,
        color: '#000',
    },
    textChatRight: {
        backgroundColor: '#0084FF',
        padding: 10,
        borderRadius: 10,
        fontSize: 16,
        color: '#fff',
    },
});