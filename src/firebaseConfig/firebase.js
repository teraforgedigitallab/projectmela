import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD4AnWICkpFHORRK7SMyPnxTvykGZ1R8EA",
    authDomain: "project-mela.firebaseapp.com",
    projectId: "project-mela",
    storageBucket: "project-mela.appspot.com",
    messagingSenderId: "288650969613",
    appId: "1:288650969613:web:52ce70111150cee13ccb44",
    measurementId: "G-7T28Q4WXD8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage, firebaseConfig };