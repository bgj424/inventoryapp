import { database, auth } from '../Database';
import { useContext } from 'react';
import { changeUserData, changeUserProfile } from './UserData';
import {
    getAuth,
    onAuthStateChanged,
    signInWithCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
    updatePassword,
} from 'firebase/auth';
import { serverTimestamp } from "firebase/database";

export const registerAccount = (email, password, username) => {
    return new Promise((resolve, reject) => {
        // register firebase account
        createUserWithEmailAndPassword(auth, email, password)
        .then(res => {
            // init user profile
            changeUserProfile({displayName: username})
            .then(res => resolve(res))
            .catch(e => reject(e))
            // init database values for user
            changeUserData({registrationDate: serverTimestamp()})
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
}

export const userSignIn = (email, password) => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {resolve(userCredential)})
    .catch(e => reject(e))
  })
}

export const userSignOut = () => {
    return new Promise((resolve, reject) => {
        signOut(auth).then(() => {
        })
        .catch(e => reject(e))
    })
}

export const reauthenticateUser = (email, password) => {
    return new Promise((resolve, reject) => {
        userSignIn(email, password).then((userCredential) => {
            reauthenticateWithCredential(auth.currentUser, userCredential).then(() => {
                resolve(userCredential)
            })
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
}

export const emailPasswordReset = (email) => {
    return new Promise((resolve, reject) => {
        sendPasswordResetEmail(auth, email)
        .then(res => resolve())
        .catch(e => reject(e))
    })
}

export const changePassword = (user, newPassword) => {
    return new Promise((resolve, reject) => {
        updatePassword(user, newPassword)
        .then(res => resolve())
        .catch(e => reject(e))
    })
}