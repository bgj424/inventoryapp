import { database, auth } from '../Database'
import { ref, get, set, child, update, remove, increment } from "firebase/database";

// Store user-specific information for an item (name for item, description...)
export const saveItemInfo = (id, name, description = null, barcode = null) => {
    return new Promise((resolve, reject) => {
        const reference = child(ref(
            database, 'users/' + auth.currentUser.uid + '/iteminfo'
        ), id)
        
        set(reference, {
            name: name,
            description: description,
            barcode: barcode
        })
        .catch(e => reject(e.code))

        resolve()
    })
}
  
// Save the item to db under user id
export const saveItem = (collection, id, name, description = null, amount) => {
    return new Promise((resolve, reject) => {
        const reference = child(ref(
            database, 'users/' + auth.currentUser.uid + '/itemdata/' + collection
        ), id)

        set(reference, {
            name: name,
            description: description,
            amount: amount
        })
        .catch(e => reject(e.code))

        update(ref(
            database, 'users/' + auth.currentUser.uid + '/collections/' + collection
        ), {
            itemCount: increment(1)
        })
        .catch(e => reject(e.code))

        resolve()
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

export const addItem = (collection, id, name, description = null, amount) => {
    return new Promise((resolve, reject) => {
        // query to check if item already exists
        get(ref(
            database, 'users/' + auth.currentUser.uid + '/itemdata/' + collection + '/' + id
        ))
        .then(snapshot => {
            const result = snapshot.val();

            if(result) {
                reject("This item already exists in the collection!")
            } else {
                saveItem(collection, id, name, description, amount)
                saveItemInfo(id, name, description)
                resolve()
            }
        })
        .catch(e => reject(e.code))
    })
}