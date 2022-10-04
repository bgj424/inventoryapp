import { useContext } from 'react';
import { database, storage, auth } from '../Database'
import firebase, { initializeApp } from "firebase/app";
import { ref, update, get } from "firebase/database";
import { updateProfile } from 'firebase/auth';
import { put, ref as sref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserContext } from '../AppContext';

export const changeUserData = (values) => {
    return new Promise((resolve, reject) => {
        update(ref(
        database, 'users/' + auth.currentUser.uid + '/userdata/'
        ), values)
        .then(res => resolve(res))
        .catch(e => reject(e))
    })
}

export const changeUserProfile = (values) => {
    return new Promise((resolve, reject) => {
        updateProfile(auth.currentUser, values)
        .then(res => resolve(res))
        .catch(e => reject(e.code))
    })
}

export const getUserAvatar = () => {
    return new Promise((resolve, reject) => {
        getDownloadURL(sref(storage, "images/" + auth.currentUser.uid + "/avatar.jpg"))
        .then((url) => {
            resolve(url)
        })
        .catch(e => reject(e.code))
    })
}

export const changeUserAvatar = async (image) => {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const avatarRef = sref(storage, "images/" + auth.currentUser.uid + "/avatar-" + new Date().getTime() + ".jpg")
    return new Promise((resolve, reject) => {
        uploadBytes(avatarRef, blob)
        .then(() => {
            getDownloadURL(avatarRef)
            .then((url) => {
                changeUserProfile({photoURL: url})

                resolve(url)
            })
            .catch(e => reject(e.code))
        })
        .catch(e => reject(e))
    })
}

export const getUserData = () => {
    return new Promise((resolve, reject) => {
        get(ref(
            database, 'users/' + auth.currentUser.uid + '/userdata'
        ), (snapshot) => {
            const data = snapshot.val();
            resolve(data)
        })
        .catch(e => reject(e))
    })
}