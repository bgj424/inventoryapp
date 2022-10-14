import { database, auth } from '../Database'
import { ref, get, set, push, child, update, remove, increment, serverTimestamp } from "firebase/database";

// Store user-specific information for an item (name for item, description...)
export const saveItemInfo = (item, key) => {
    if(item.barcode) key = item.barcode
    return new Promise((resolve, reject) => {
        const db_ref = ref(database, 'users/' + auth.currentUser.uid + '/iteminfo/' + key)
        
        update(db_ref, {
            ...item,
            amount: null
        })
        .then(res => resolve(res))
        .catch(e => reject(e.code))
    })
}
  
// Save the item to db under user id
export const saveItem = (collection, item) => {
    let db_path = ""
    let db_ref = ""

    if(collection.shared) {
        db_path = ref(database, 'shared')
        db_ref = child(db_path, '/itemdata/' + collection.accessCode)
    } else {
        db_path = ref(database, 'users/' + auth.currentUser.uid)
        db_ref = child(db_path, '/itemdata/' + collection.name)
    }

    return new Promise((resolve, reject) => {
        if(item.barcode) { 
            // Edit existing item or create one with specified key
            update(child(db_ref, item.barcode), {
                name: item.name,
                description: item.description,
                amount: item.amount
            })
            .then(res => resolve(item.barcode))
            .catch(e => reject(e.code))

        } else { 
            // Push new item with new key
            let key =
            push(db_ref, {
                ...item,
                added: serverTimestamp(),
            }).key

            // Update collection info
            update(child(
                db_path, '/collections/' + (collection.shared ? collection.accessCode : collection.name)
            ), {
                itemCount: increment(1)
            })
            .then(res => resolve(key)) // return the key (id) in db
            .catch(e => reject(e.code))
        }
    })
}

export const removeItem = (collection, id) => {
    return new Promise((resolve, reject) => {
        // Get key which identifies the collection
        remove(ref(
            database, 'users/' + auth.currentUser.uid + '/itemdata/' + collection + "/" + id
        ))
        .catch(e => reject(e.code))

        update(ref(
            database, 'users/' + auth.currentUser.uid + '/collections/' + collection
        ), {
            itemCount: increment(-1)
        })
        .catch(e => reject(e.code))

        resolve()
    })
}

const checkItem = (collection, key) => {
    return new Promise((resolve, reject) => {
        if(key) {
            // query to check if item already exists
            get(ref(
                database, 'users/' + auth.currentUser.uid + '/itemdata/' + collection + '/' + key
            ))
            .then(snapshot => {
                if(snapshot.exists()) {
                    reject("This item already exists in the collection!")
                } else {
                    resolve()
                }
            })
            .catch(e => reject(e))
        } else {
            resolve()
        }
    })
}

// Add a new item to the database
export const addItem = (collection, item) => {
    return new Promise((resolve, reject) => {
        // query to check if item already exists
        if(item.barcode !== null) {
            checkItem(collection.name, item.barcode)
            .catch(e => reject(e))
        }

        saveItem(collection, item)
        .then(key => {
            saveItemInfo(item, key)
            .then(res => resolve(res))
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
}

