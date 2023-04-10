import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyClGI_c6lJ-DKipEonOc9itTAPHDM5BLLk",
    authDomain: "vku-sm.firebaseapp.com",
    databaseURL: "https://vku-sm-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vku-sm",
    storageBucket: "vku-sm.appspot.com",
    messagingSenderId: "538436805298",
    appId: "1:538436805298:web:2ea677e1ea638c5bc59fab",
    measurementId: "G-YSTRXHPNGN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export default app;
