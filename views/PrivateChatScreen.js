import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Pressable, Image, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import firebase, { auth, onAuthStateChanged } from 'firebase/app';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as databaseRef, set, onValue } from "firebase/database";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { getAuth } from "firebase/auth";
import ChatContainerView from './ChatContainerView';

const PrivateChatScreen = ({ navigation, route }) => {

    const storage = getStorage();
    const auth = getAuth();
    const database = getDatabase();
    const currentUserUid = auth.currentUser.uid;
    const receivedId = route.params?.receivedId || 0;
    const [userReceivedName, setUserReceivedName] = useState('')
    const [refreshing, setRefreshing] = useState(false);
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState(null);

    //fetch user uid current
    useEffect(() => {
        const userRef = databaseRef(database, 'users/' + receivedId);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            const userReceivedName = userData.name;
            setUserReceivedName(userReceivedName);
        });
    }, []);

    // refresh page
    const onRefresh = () => {
        setRefreshing(true);
        navigation.reset({
            index: 0,
            routes: [{ name: 'PrivateChatScreen', params: { receivedId: receivedId } }],
        });
    }


    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 1200,
            height: 780,
            cropping: true,
        }).then((image) => {
            let imageUri = '';
            if (Platform.OS === 'android') {
                imageUri = image.path;
            } else {
                imageUri = image.uri;
            }
            setImage(imageUri);
            console.log(imageUri)
        });
    };

    const submitMesage = async () => {
        try {
            const imageUrl = await uploadImage();
            const timestamp = new Date().getTime();

            await set(databaseRef(database, `message/${currentUserUid}-${receivedId}` + '/' +  timestamp), {
                messageText: message,
                sentId: currentUserUid,
                receivedId: receivedId,
                messageImg: imageUrl,
                likes: null,
                timestamp: new Date().getTime(),
            });
            await set(databaseRef(database, `message/${receivedId}-${currentUserUid}` + '/' +  timestamp), {
                messageText: message,
                sentId: currentUserUid,
                receivedId: receivedId,
                messageImg: imageUrl,
                likes: null,
                timestamp: new Date().getTime(),
            });

            console.log('Message Added!');
            setMessage(null);
        } catch (error) {
            console.log('Something went wrong with adding message to Realtime Database.', error);
            
        }
    }

    const uploadImage = async () => {
        if (image == null) {
            return null;
        }
        const uploadUri = image;
        const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

        // Add timestamp to File Name
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        const newFilename = `${name}-${Date.now()}.${extension}`;
        const photosRef = storageRef(storage, 'messages/' + newFilename);
        const metadata = {
            contentType: 'image/jpeg'
        };
        const response = await fetch(uploadUri);
        const blob = await response.blob();

        try {
            await uploadBytes(photosRef, blob, metadata);
            const downloadURL = await getDownloadURL(photosRef)
            setImage(null);
            console.log(downloadURL);
            return downloadURL;
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerPrivateChat}>
                <View style={styles.headerPrivateChatLeft}>
                    <Pressable onPress={() => navigation.navigate('ChatScreen')}>
                        <Icon name="arrow-left" color='#000' size={25} />
                    </Pressable>
                    <Text style={styles.textChatHeader}>{userReceivedName}</Text>
                </View>

                <View style={styles.headerPrivateChatRight}>
                    <Pressable >
                        <Icon name="ellipsis-h" color='#000' size={25} />
                    </Pressable>
                </View>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <ChatContainerView receivedId={receivedId}/>
            </ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === 'android' ? '70' : 'height'} >
                {image && <Image style={styles.imageMessage} source={{ uri: image }} />}
                <View style={styles.message}>
                    <TextInput style={styles.inputMessage}
                        value={message}
                        onChangeText={(content) => setMessage(content)} />

                    <Pressable style={styles.buttonMessage} onPress={choosePhotoFromLibrary}>
                        <Icon name="paperclip" color='#000' size={25} />
                    </Pressable>
                    <Pressable style={styles.buttonMessage} onPress={submitMesage}>
                        <Icon name="paper-plane" color='#000' size={25} />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
            <View style={styles.blackPrivateChatContainer}>

            </View>
        </View>
    )
};

export default PrivateChatScreen;


const styles = StyleSheet.create({
    imageMessage: {
        // width: 300,
        height: 250,
        marginVertical: 15,
        borderRadius: 20,

    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerPrivateChat: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    headerPrivateChatLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textChatHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerPrivateChatRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    privateChatContainer: {
        flex: 1,
        padding: 10,
    },
    chatLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    imageAvatarUser: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    textChatLeft: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 10,
    },
    chatRight: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        //   justifyContent: 'flex-end',
        marginBottom: 10,
    },
    textChatRight: {
        backgroundColor: '#2db84c',
        color: '#fff',
        padding: 10,
        borderRadius: 10,
    },
    message: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    inputMessage: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 25,
        marginRight: 10,
    },
    buttonMessage: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
    },
    blackPrivateChatContainer: {
        height: 75,
        //   backgroundColor: '#000',
    },
});
