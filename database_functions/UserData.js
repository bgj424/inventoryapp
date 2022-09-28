import { database, auth } from '../Database'
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

export const changeUserData = (values) => {
    update(ref(
      database, 'users/' + auth.currentUser.uid + '/userdata/'
    ), values)
}