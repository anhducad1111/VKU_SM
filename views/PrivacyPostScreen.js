import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Pressable } from 'react-native';
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome5';

const PrivacyPostScreen = ({ navigation }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const handleBack = () => {
        navigation.navigate('AddPostScreen', { privacyOption: activeIndex });
        console.log(activeIndex);
    };

    const goBackWithParams = () => {
        handleBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerAddPost}>
                <View style={styles.headerAddPostLeft}>
                    <Pressable onPress={goBackWithParams}>
                        <Icon name="arrow-left" color='#000' size={25} />
                    </Pressable>
                </View>
                <View>
                    <Text style={styles.headerText}>Privacy Options</Text>
                </View>
                <View style={styles.headerAddPostLeft}>
                </View>
            </View>
            <View>
                <>
                    <Pressable
                        style={[
                            styles.buttonOption,
                            activeIndex === 0 && { backgroundColor: '#ccc' }
                        ]}
                        onPress={() => setActiveIndex(0)}
                    >
                        <View style={styles.iconPrivacy}>
                            <Icon name="globe" color='#000' size={25} />
                        </View>
                        <View style={styles.textPrivacy}>
                            <Text style={styles.upText}>Public</Text>
                            <Text style={styles.downText}>Any one on VKU SM</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.buttonOption,
                            activeIndex === 1 && { backgroundColor: '#ccc' }
                        ]}
                        onPress={() => setActiveIndex(1)}
                    >
                        <View style={styles.iconPrivacy}>
                            <Icon name="users" color='#000' size={25} />
                        </View>
                        <View style={styles.textPrivacy}>
                            <Text style={styles.upText}>Friends</Text>
                            <Text style={styles.downText}>Your friends on VKU SM</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.buttonOption,
                            activeIndex === 2 && { backgroundColor: '#ccc' }
                        ]}
                        onPress={() => setActiveIndex(2)}
                    >
                        <View style={styles.iconPrivacy}>
                            <Icon name="lock" color='#000' size={25} />
                        </View>
                        <View style={styles.textPrivacy}>
                            <Text style={styles.upText}>Private</Text>
                            <Text style={styles.downText}>Only me</Text>
                        </View>
                    </Pressable>
                </>
            </View>
        </View>
    )
};

export default PrivacyPostScreen;

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
    headerText: {
        color: '#000',
        fontSize: 25,
        fontWeight: 'bold',
    },
    buttonOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        marginHorizontal: 10,
        marginTop: 20,
    },
    iconPrivacy: {
        width: 40,
        marginRight: 20,
    },
    upText: {
        // fontWeight: 'bold',
        color: '#000',
        fontSize: 20,
    },
    downText: {
        color: '#666',
        fontSize: 20,
    },
})