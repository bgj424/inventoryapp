// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { getStorage, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyBySD80DqLntOYzU5MClQLTyezFpztNnOY",
    authDomain: "inventoryapp-b3fb5.firebaseapp.com",
    databaseURL: "https://inventoryapp-b3fb5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "inventoryapp-b3fb5",
    storageBucket: "inventoryapp-b3fb5.appspot.com",
    messagingSenderId: "74240360376",
    appId: "1:74240360376:web:5a11e112af1e68807a594d",
    measurementId: "G-T2SSHRQ808"  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getDatabase(app);
export const storage = getStorage(app);

