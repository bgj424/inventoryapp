import { database, auth } from '../Database'
// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  push, 
  ref, 
  get, 
  set, 
  child, 
  query, 
  orderByChild, 
  equalTo,
  update,
  remove, 
  serverTimestamp, 
  increment
} from "firebase/database";

import {
    getAuth,
    onAuthStateChanged,
    signInWithCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut 
} from 'firebase/auth';

export const registerAccount = (email, password) => {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        userCredential.user 
          ? resolve(userCredential.user)
          : reject("User credentials not found")
      })
      .catch((error) => { // firebase does not accept registration
        reject(error.message)
      })
    })
}

export const logIn = (email, password) => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      userCredential.user 
        ? resolve(userCredential.user)
        : reject("User credentials not found")
    })
    .catch((error) => {
      reject(error.message)
    })
  })
}

export const logOut = () => {
    signOut(auth).then(() => {
    })
    .catch((error) => {
        console.log("Logout error" + error)
    });
}