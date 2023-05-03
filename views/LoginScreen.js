import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, StatusBar, Image, LayoutAnimation, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const auth = getAuth();
    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('BottomStackNavigationUI');
        } catch (error) {
            console.log('Login error: ', error);
        }
    };

    LayoutAnimation.easeInEaseOut();
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <Image
                source={require('../assets/authHeader.png')}
                style={{ width: 504, resizeMode: 'contain', marginLeft: -50, marginTop: -100, marginBottom: 0 }}
            />
            <Image
                source={require('../assets/authHeader.png')}
                style={{ width: 504, resizeMode: 'contain', position: 'absolute', bottom: -180, left: 50, opacity: 0.4, transform: [{ rotate: '-20deg' }] }}
            />
            <Image
                source={require('../assets/loginLogo.png')}
                style={{ resizeMode: 'contain', width: 180, marginTop: -180, marginBottom: -100, alignSelf: 'center' }}
            />

            <Text style={styles.greeting}>{`VKU SM`}</Text>

            <View style={styles.errorMessage}>
                {!!error && <Text style={styles.error}>{error}</Text>}
            </View>

            <View style={styles.form}>
                <KeyboardAvoidingView behavior={Platform.OS === 'android' ? '100' : 'height'} >
                    <View>
                        <Text style={styles.inputTitle}>Email</Text>
                        <KeyboardAvoidingView behavior={Platform.OS === 'android' ? '70' : 'height'} >
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                onChangeText={email => setEmail(email)}
                                value={email}
                            />
                        </KeyboardAvoidingView>
                    </View>
                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Password</Text>
                        <KeyboardAvoidingView behavior={Platform.OS === 'android' ? '70' : 'height'} >
                            <TextInput
                                style={styles.input}
                                secureTextEntry
                                autoCapitalize="none"
                                onChangeText={password => setPassword(password)}
                                value={password}
                            />
                        </KeyboardAvoidingView>
                    </View>
                </KeyboardAvoidingView >
            </View>

            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign in</Text>
            </Pressable>

            <Pressable style={{ alignSelf: 'center', marginTop: 32 }} onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                <Text style={{ color: '#414959', fontSize: 13 }}>
                    Forgot Password? <Text style={{ fontWeight: '500', color: '#1F7EED' }}>Click Here!</Text>
                </Text>
            </Pressable>
        </View>
    )
};

export default LoginScreen;

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