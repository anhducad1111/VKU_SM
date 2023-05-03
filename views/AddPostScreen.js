import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Pressable, TextInput, Alert } from 'react-native';
import { getAuth } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as databaseRef, set, onValue } from "firebase/database";
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';

const AddPostScreen = ({ navigation, route }) => {
    const storage = getStorage();
    const database = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
    const currentUserUid = user.uid;
    // lấy user name của người dùng hiện tại
    const [userName, setUserName] = useState('');
   
    useEffect(() => {
        const userRef = databaseRef(database, 'users/' + currentUserUid);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            const userName = userData.name;
            setUserName(userName);
        });
    }, []);

    // nút thêm ảnh 
    const [showAddButtons, setShowAddButtons] = useState(false);
    const handlePressAddImage = () => {
        setShowAddButtons(!showAddButtons);
    };

    const [image, setImage] = useState(null);
    const [post, setPost] = useState(null);

    const privacyOption = route.params?.privacyOption || 0;
    const PRIVACY_OPTIONS = {
        0: 'Public',
        1: 'Friends',
        2: 'Private'
    }
    const privacyOptionText = PRIVACY_OPTIONS[privacyOption];


    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            width: 1200,
            height: 780,
            cropping: true,
        }).then((image) => {
            console.log(image);
            let imageUri = '';
            if (Platform.OS === 'android') {
                imageUri = image.path;
            } else {
                imageUri = image.uri;
            }
            setImage(imageUri);
        });
    };

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
        });
    };

    const submitPost = async () => {
        try {
            const imageUrl = await uploadImage();

            await set(databaseRef(database, 'posts/' + user.uid + '/' + new Date().getTime()), {
                postText: post,
                privacy: privacyOption,
                postImg: imageUrl,
                likes: null,
                comments: null,
                timestamp: new Date().getTime(),
            });

            console.log('Post Added!');
            Alert.alert(
                'Post published!',
                'Your post has been published Successfully!',
            );
            setPost(null);
        } catch (error) {
            console.log('Something went wrong with adding post to Realtime Database.', error);
            Alert.alert(
                'Error',
                'Something went wrong with publishing your post. Please try again later.',
            );
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
        const photosRef = storageRef(storage, 'photos/' + newFilename);
        const metadata = {
            contentType: 'image/jpeg'
        };
        const response = await fetch(uploadUri);
        const blob = await response.blob();

        try {
            await uploadBytes(photosRef, blob, metadata);
            const downloadURL = await getDownloadURL(photosRef)
            setImage(null);
            return downloadURL;
        } catch (e) {
            console.log(e);
            return null;
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.headerAddPost}>
                <View style={styles.headerAddPostLeft}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" color='#000' size={25} />
                    </Pressable>
                </View>

                <View style={styles.headerAddPostRight}>
                    <Pressable onPress={submitPost}>
                        <Text style={styles.textAddHeader}>Next</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.addPostContainer}>
                <View style={styles.topAddPost}>
                    <View style={styles.avatarUser}>
                        <Image style={styles.imageAvatarUser}
                            source={require('../assets/tempAvatar.jpg')} />
                    </View>
                    <View style={styles.textTopAdd}>
                        <Text style={styles.textName}>{userName}</Text>
                        <View style={styles.privacyOptions}>
                            <Pressable onPress={() => navigation.navigate('PrivacyPostScreen')}>
                                <Text style={styles.textPrivacy}>{privacyOptionText}</Text>
                            </Pressable>
                            <Icon style={styles.iconPrivacy} name="caret-down" color='#000' size={15} />
                        </View>
                    </View>
                </View>
                <View style={styles.midAddPost}>
                    <TextInput style={styles.textInputAddPost}
                        numberOfLines={4}
                        value={post}
                        onChangeText={(content) => setPost(content)} />
                </View>
                {image && <Image style={styles.imagePost} source={{ uri: image }} />}
                <View style={styles.iconAddImage}>
                    <Pressable onPress={handlePressAddImage}>
                        <Icon name="plus" color='#000' size={25} />
                    </Pressable>
                    {showAddButtons && (
                        <>
                            <View style={{ flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <Pressable style={styles.alignText}
                                    onPress={takePhotoFromCamera}>
                                    <Text style={styles.textAddImage}>Chup anh</Text>
                                </Pressable>
                                <Pressable style={styles.alignText}
                                    onPress={choosePhotoFromLibrary}>
                                    <Text style={styles.textAddImage}>Chon anh tu thu vien</Text>
                                </Pressable>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </View>
    )
};


export default AddPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerAddPost: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    headerAddPostLeft: {
        width: 50
    },
    headerAddPostRight: {
        width: 50,
        alignItems: 'flex-end'
    },
    textAddHeader: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold'
    },
    addPostContainer: {
        flex: 1,
        padding: 16
    },
    topAddPost: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    avatarUser: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
        marginRight: 10,
    },
    imageAvatarUser: {
        width: '100%',
        height: '100%',
    },
    textTopAdd: {
        flex: 1,
        // flexDirection: 'row',
    },
    textName: {
        fontSize: 18,
        fontWeight: 'bold',
        // color: '#00FF00',
        color: '#666',
    },
    privacyOptions: {
        borderColor: 'black',
        borderWidth: 1,
        width: 110,
        padding: 5,
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textPrivacy: {
        fontSize: 14,
        color: '#666',
    },
    iconPrivacy: {
        // marginHorizontal: 15,
    },
    midAddPost: {
        marginBottom: 16
    },
    textInputAddPost: {
        height: 200,
        borderWidth: 1,
        borderColor: '#808080',
        borderRadius: 8,
        padding: 8,
        textAlignVertical: 'top',
        color: '#666',
    },
    iconAddImage: {
        alignItems: 'center'
    },
    textAddImage: {
        borderWidth: 1,
        // width: 100,
        height: 50,
        padding: 15,
        margin: 10,
        borderRadius: 20,
        alignItems: 'center',
        color: '#666',
    },
    imagePost: {
        // width: 300,
        height: 250,
        marginVertical: 15,
        borderRadius: 20,
        
    }
})