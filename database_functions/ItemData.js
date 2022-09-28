import { database, auth } from '../Database'
import { ref, get, set, child, update,remove, increment } from "firebase/database";

// Store user-specific information for an item (name for item, description...)
export const saveItemInfo = (id, name, description) => {
    const reference = child(ref(
      database, 'users/' + auth.currentUser.uid + '/iteminfo'
    ), id)
    
    set(reference, {
      name: name,
      description: description,
    })
}
  
// Save the item to db under user id
export const saveItem = (collection, id, name, description, amount) => {
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

export const addItem = (collection, id, name, description, amount) => {
    return new Promise((resolve, reject) => {
        // query to check if item already exists
        get(ref(
        database, 'users/' + auth.currentUser.uid + '/itemdata/' + collection + '/' + id
        ))
        .then(snapshot => {
        const result = snapshot.val();

        if(result) {
            reject("Item name already exists!")
        } else {
            saveItem(collection, id, name, description, amount)
            saveItemInfo(id, name, description)
            resolve()
        }
        })
    })
}