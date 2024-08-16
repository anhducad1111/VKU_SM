import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  StatusBar,
  Image,
  LayoutAnimation,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import firebase from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "538436805298-oop7q0srq2d2d962fli8tremovrgu4bq.apps.googleusercontent.com",
    });
  }, []);
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("BottomStackNavigationUI");
    } catch (error) {
      console.log("Login error: ", error);
    }
  };

  const handleLoginWithGoogle = async () => {

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken, user } = await GoogleSignin.signIn();
      Alert.alert("Login with Google successfully");
      const googleCredential = GoogleAuthProvider.credential(idToken);
  
      await signInWithCredential(auth, googleCredential);
      navigation.navigate("BottomStackNavigationUI");
    } catch (error) {
      console.log("Login with Google error: ", error);
    }
    
  };

  LayoutAnimation.easeInEaseOut();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Image
        source={require("../../assets/authHeader.png")}
        style={{
          width: 504,
          resizeMode: "contain",
          marginLeft: -50,
          marginTop: -120,
          marginBottom: 0,
        }}
      />
      <Image
        source={require("../../assets/authHeader.png")}
        style={{
          width: 504,
          resizeMode: "contain",
          position: "absolute",
          bottom: -180,
          left: 50,
          opacity: 0.4,
          transform: [{ rotate: "-20deg" }],
        }}
      />
      <Image
        source={require("../../assets/loginLogo.png")}
        style={{
          resizeMode: "contain",
          width: 180,
          marginTop: -200,
          marginBottom: -120,
          alignSelf: "center",
        }}
      />

      <Text style={styles.greeting}>{`VKU SM`}</Text>

      <View style={styles.errorMessage}>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={styles.form}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "100" : "height"}
        >
          <View>
            <Text style={styles.inputTitle}>Email</Text>
            <KeyboardAvoidingView
              behavior={Platform.OS === "android" ? "70" : "height"}
            >
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                onChangeText={(email) => setEmail(email)}
                value={email}
              />
            </KeyboardAvoidingView>
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={styles.inputTitle}>Password</Text>
            <KeyboardAvoidingView
              behavior={Platform.OS === "android" ? "70" : "height"}
            >
              <TextInput
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={(password) => setPassword(password)}
                value={password}
              />
            </KeyboardAvoidingView>
          </View>
        </KeyboardAvoidingView>
      </View>

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
      <Pressable
        style={[
          styles.button,
          { marginTop: 10, marginHorizontal: 70, backgroundColor: "#FF3B30" },
        ]}
        onPress={handleLoginWithGoogle}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </Pressable>

      <Pressable
        style={{ alignSelf: "center", marginTop: 24 }}
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
      >
        <Text style={{ color: "#414959", fontSize: 13 }}>
          Forgot Password?{" "}
          <Text style={{ fontWeight: "500", color: "#1F7EED" }}>
            Click Here!
          </Text>
        </Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 48,
    fontWeight: "800",
    textAlign: "center",
    color: "#007AFF",
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "#FF3B30",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    marginTop: -50,
    marginBottom: 30,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: "#8a8f9e",
    fontSize: 10,
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "#8a8f9e",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161f3d",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#1F7EED",
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
  },
});
