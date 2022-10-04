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
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getDatabase(app);
export const storage = getStorage(app);

