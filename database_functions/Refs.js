import { database, auth } from '../Database'
import { ref, child } from "firebase/database";

export const userRef = ref(database, 'users/' + auth.currentUser.uid + '/')
export const itemDataRef = ref(database, 'users/' + auth.currentUser.uid + '/itemdata/')
export const userDataRef = ref(database, 'users/' + auth.currentUser.uid + '/userdata/')
export const itemInfoRef = ref(database, 'users/' + auth.currentUser.uid + '/iteminfo/')
export const collectionDataRef = ref(database, 'users/' + auth.currentUser.uid + '/collections/')