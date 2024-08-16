import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Image, LayoutAnimation } from 'react-native';
import * as firebase from 'firebase/compat/app';

const ForgotPassWordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = () => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(err => setError(err.message))
    }

    LayoutAnimation.easeInEaseOut();
    return (
        <View style={styles.container}>

            <Image
                source={require('../../assets/authHeader.png')}
                style={{ width: 504, resizeMode: 'contain', position: 'absolute', bottom: -180, left: 50, opacity: 0.4, transform: [{ rotate: '-20deg' }] }}
            />
            <Image
                source={require('../../assets/loginLogo.png')}
                style={{ resizeMode: 'contain', width: 180, marginTop: -180, marginBottom: -100, alignSelf: 'center' }}
            />

            <Text style={styles.greeting}>{`VKU SM`}</Text>

            <View style={styles.errorMessage}>
                {!!error && <Text style={styles.error}>{error}</Text>}
            </View>

            <View style={styles.form}>
                <View>
                    <Text style={styles.inputTitle}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        onChangeText={email => setEmail(email)}
                        value={email}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>

        </View>
    )
};

export default ForgotPassWordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    greeting: {
        fontSize: 48,
        fontWeight: '800',
        textAlign: 'center',
        color: '#007AFF',
    },
    errorMessage: {
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: '#FF3B30',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30,
    },
    inputTitle: {
        color: '#8a8f9e',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    input: {
        borderBottomColor: '#8a8f9e',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: '#161f3d',
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: '#1F7EED',
        borderRadius: 26,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '500',
    }
});