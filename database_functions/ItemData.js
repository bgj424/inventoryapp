import { database, auth } from '../Database'
import { ref, get, set, push, child, update, remove, increment, serverTimestamp } from "firebase/database";

// Store user-specific information for an item (name for item, description...)
export const saveItemInfo = (id, name, description = null, barcode = null) => {
    return new Promise((resolve, reject) => {
        const reference = child(ref(
            database, 'users/' + auth.currentUser.uid + '/iteminfo'
        ), id)
        
        update(reference, {
            name: name,
            description: description,
            barcode: barcode
        })
        .then(res => resolve(res))
        .catch(e => reject(e.code))
    })
}
  
// Save the item to db under user id
export const saveItem = (collection, name, amount, id = null, description = null) => {
    return new Promise((resolve, reject) => {
        if(id) { 
            // Edit existing item or create one with specified key
            const reference = child(ref(
                database, 'users/' + auth.currentUser.uid + '/itemdata/' + collection
            ), id)

            update(reference, {
                name: name,
                description: description,
                amount: amount
            })
            .then(res => resolve(id))
            .catch(e => reject(e.code))

        } else { 
            // Push new item with new key
            let key = 
                push(ref(database, 'users/' + auth.currentUser.uid + '/itemdata/' + collection), {
                    name: name,
                    description: description,
                    amount: amount,
                    added: serverTimestamp(),
                })
                .catch(e => reject(e.code))

            update(ref(
                database, 'users/' + auth.currentUser.uid + '/collections/' + collection
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
export const addItem = (collection, name, amount, barcode = null, description = null) => {
    return new Promise((resolve, reject) => {
        // query to check if item already exists
        console.log("add", 1)
        checkItem(collection, barcode)
        .then(res => {
            console.log("add", 2)
            saveItem(collection, name, amount, barcode, description)
            .then(key => {
                console.log("add", 5)
                saveItemInfo(key, name, description, barcode)
                .then(res => resolve(res))
                .catch(e => reject(e))
            })
        })
        .catch(e => reject(e))
    })
}