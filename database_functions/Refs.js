import { database, auth } from '../Database'
import { ref, child } from "firebase/database";

/*
export const userRef = ref(database, 'users/' + auth.currentUser.uid + '/')
export const itemDataRef = ref(database, 'users/' + auth.currentUser.uid + '/itemdata/')
export const userDataRef = ref(database, 'users/' + auth.currentUser.uid + '/userdata/')
export const itemInfoRef = ref(database, 'users/' + auth.currentUser.uid + '/iteminfo/')
export const inventoryDataRef = ref(database, 'users/' + auth.currentUser.uid + '/inventories/')

export const refs = {
    user: ref(database, 'users/' + auth.currentUser.uid),
    shared: ref(database, 'shared/inventories/')
}
*/