

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";

import {
    getAuth,
    onAuthStateChanged,
    signInWithCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut 
  } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
// firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth();

// Database functions
export function registerAccount(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return userCredential.user;
      })
      .catch((error) => {
        return null;
      });
}

export const logIn = (email, password) => {
  let result;
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    return true
  })
  .catch((error) => {
    return error.message;
  });
} 
export const logOut = () => {
    signOut(auth).then(() => {
      console.log("User logged out")
    }).catch((error) => {
        console.log("Logout error" + error)
    });
}

// Add new item to db under user id
export const addItemInfo = (barcode, name, description) => {
    const reference = ref(database, 'users/' + auth.currentUser.uid + '/iteminfo');
    push(reference, {
        barcode: barcode,
        name: name,
        description: description
    });
}

// Add new item to db under user id
export const storeItem = (barcode, name, description, amount) => {
    const reference = ref(database, 'users/' + auth.currentUser.uid + '/itemdata');
    push(reference, {
        barcode: barcode,
        name: name,
        description: description,
        amount: amount
    });
}