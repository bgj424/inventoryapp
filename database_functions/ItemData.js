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
export const saveItem = (inventory, item) => {
    let db_path = ""
    let db_ref = ""
    let inventoryKey = ""

    if(inventory.shared) {
        db_path = ref(database, 'shared')
        db_ref = child(db_path, '/itemdata/' + inventory.accessCode)
        inventoryKey = inventory.accessCode
    } else {
        db_path = ref(database, 'users/' + auth.currentUser.uid)
        db_ref = child(db_path, '/itemdata/' + inventory.name)
        inventoryKey = inventory.name
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

            // Update inventory info
            update(child(
                db_path, '/inventories/' + inventoryKey
            ), {
                itemCount: increment(1)
            })
            .then(res => resolve(key)) // return the key (id) in db
            .catch(e => reject(e.code))
        }
    })
}

export const removeItem = (inventory, key) => {
    let db_path = ""
    let inventoryKey = ""

    if(inventory.shared) {
        db_path = ref(database, 'shared')
        inventoryKey = inventory.accessCode
    } else {
        db_path = ref(database, 'users/' + auth.currentUser.uid)
        inventoryKey = inventory.name
    }

    return new Promise((resolve, reject) => {
        // Get key which identifies the inventory
        remove(child(db_path, '/itemdata/' + inventoryKey + "/" + key))
        .catch(e => reject(e.code))

        update(child(db_path, '/inventories/' + inventoryKey), {
            itemCount: increment(-1)
        })
        .catch(e => reject(e.code))

        resolve()
    })
}

const checkItem = (inventory, key) => {
    return new Promise((resolve, reject) => {
        if(key) {
            // query to check if item already exists
            get(ref(
                database, 'users/' + auth.currentUser.uid + '/itemdata/' + inventory + '/' + key
            ))
            .then(snapshot => {
                if(snapshot.exists()) {
                    reject("This item already exists in the inventory!")
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
export const addItem = (inventory, item) => {
    return new Promise((resolve, reject) => {
        // query to check if item already exists
        if(item.barcode !== null) {
            checkItem(inventory.name, item.barcode)
            .catch(e => reject(e))
        }

        saveItem(inventory, item)
        .then(key => {
            saveItemInfo(item, key)
            .then(res => resolve(res))
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
}

