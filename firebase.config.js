import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClGI_c6lJ-DKipEonOc9itTAPHDM5BLLk",
  authDomain: "vku-sm.firebaseapp.com",
  databaseURL: "https://vku-sm-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vku-sm",
  storageBucket: "vku-sm.appspot.com",
  messagingSenderId: "538436805298",
  appId: "1:538436805298:web:04b35cc0e778a379c59fab",
  measurementId: "G-WBNPE655HQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;
export { auth };
