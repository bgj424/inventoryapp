

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

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth();

// Database functions
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
      });
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
    });
  })
}

export const logOut = () => {
    signOut(auth).then(() => {
    })
    .catch((error) => {
        console.log("Logout error" + error)
    });
}

// Add new item collection
export const addCollection = (name, color) => {

  return new Promise((resolve, reject) => {
    // query to check if collection already exists
    get(ref(
      database, 'users/' + auth.currentUser.uid + '/collections/' + name)
    )
    .then(snapshot => {
      const result = snapshot.val();

      if(result) {
          reject("Collection name already exists!")
      } else {
        const reference = child(ref(
          database, 'users/' + auth.currentUser.uid + '/collections/'
        ), name)
      
        set(reference, {
          itemCount: 0,
          color: color,
          creationDate: serverTimestamp()
        });
        resolve(name)
      }
    })
  })
}

export const removeCollection = (name) => {
  remove(ref(
    database, 'users/' + auth.currentUser.uid + '/collections/' + name
  ))
  remove(ref(
    database, 'users/' + auth.currentUser.uid + '/itemdata/' + name
  ))
}

// Store user-specific information for an item (name for item, description...)
export const addItemInfo = (id, name, description) => {
  const reference = child(ref(
    database, 'users/' + auth.currentUser.uid + '/iteminfo'
  ), id)
  
  set(reference, {
    name: name,
    description: description,
  });
}

// Add new item to db under user id
export const storeItem = (collection, id, name, description, amount) => {
  const reference = child(ref(
    database, 'users/' + auth.currentUser.uid + '/itemdata/' + collection
  ), id)

  set(reference, {
    name: name,
    description: description,
    amount: amount
  });

  update(ref(
    database, 'users/' + auth.currentUser.uid + '/collections/' + collection
  ), {
    itemCount: increment(1)
  })

}

export const removeItem = (collection, id) => {
  // Get key which identifies the collection
  remove(ref(
    database, 'users/' + auth.currentUser.uid + '/itemdata/' + collection + "/" + id
  ))
  
  update(ref(
    database, 'users/' + auth.currentUser.uid + '/collections/' + collection
  ), {
    itemCount: increment(-1)
  })
}

export const changeUserSettings = (setting) => {
  set(ref(
    database, 'users/' + auth.currentUser.uid + '/userdata/'
  ), setting)
}