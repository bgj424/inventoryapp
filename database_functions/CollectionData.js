import { database, auth } from '../Database'
import { ref, get, set, child, remove, serverTimestamp, update } from "firebase/database";
import { TabRouter } from 'react-navigation';

export const editCollection = (name, values) => {
  let collectionRef
  let itemsRef
  
  if(values.shared) {
    collectionRef = ref(database, 'shared/collections/' + values.accessCode)
    itemsRef = ref(database, 'shared/itemdata/' + values.accessCode)
  } else {
    collectionRef = ref(database, 'users/' + auth.currentUser.uid + '/collections/')
    itemsRef = ref(database, 'users/' + auth.currentUser.uid + '/itemdata/')
  }
  
  return new Promise((resolve, reject) => {
    if(name !== values.name) { // Data needs to be readded if name is changed
      // Check if name is already taken
      get(child(collectionRef, values.name))
      .then(snapshot => {
        const existingData = snapshot.val();

        if(existingData) {
            reject("Collection name already exists!")
            
        } else {
          // Get items in the collection
          get(child(itemsRef, name))
          .then(snapshot => {
            const itemdata = snapshot.val()

            // Move items from old db location to new
            set(child(itemsRef, values.name), 
            {...itemdata})
            .catch(e => reject(e))

            // Move collection info
            get(child(collectionRef, name))
            .then(snapshot => {
              const collectiondata = snapshot.val()
              addCollection(
                values.name, {
                  ...collectiondata,
                  ...values
                }
              )
              .catch(e => reject(e))
            })
            .catch(e => reject(e))
            
            // Remove old data
            removeCollection(name)
            .catch(e => reject(e))

            resolve()
          })
        }
      })
    } else { // No name change required
      update(ref(database, 'users/' + auth.currentUser.uid + '/collections/' + oldName), {
        values
      })
      .then(res => resolve())
      .catch(e => reject(e))
    }
  })
}

// Creates collection which is accessible for multiple users with a code
const createSharedCollection = (name, values) => {
  // Creates a random identifier which is used to access the shared collection
  let accessCode = (Math.random() + 1).toString(36).substring(7)
  let reference = ref(database, 'shared/collections/' + accessCode)
  console.log("New shared collection: " + accessCode)

  return new Promise((resolve, reject) => {
    get(reference)
    .then(snapshot => {
      const result = snapshot.val();
      if(!result) {
        set(reference, {...values, name: name})
        .catch(e => reject(e))
        update(ref(database, 'users/' + auth.currentUser.uid + '/collections/' + name),{
          ...values,
          accessCode: accessCode
        })
        .catch(e => reject(e))

        resolve(accessCode)
      } else {
        // retry if exists
        createSharedCollection()
        .then(res => resolve(res))
        .catch(e => reject(e))
      }
    })
    .catch(e => reject(e))
  })
}

// Creates collection which is accessible under user id
const createPrivateCollection = (name, values) => {
  let reference = ref(database, 'users/' + auth.currentUser.uid + '/collections/' + name)

  return new Promise((resolve, reject) => {
    // query to check if collection already exists
    get(reference)
    .then(snapshot => {
      const result = snapshot.val();
      if(result) {
          reject("Collection name already exists!")
      } else {
        set(reference, {...values, shared: false})
        .then(res => resolve())
        .catch(e => reject(e))
      }
    })
    .catch(e => reject(e))
  })
}

// Add new item collection
export const addCollection = (name, values = {}) => {

    const initValues = {
      ...values,
      itemCount: values.itemCount ?? 0,
      creationDate: values.timestamp ?? serverTimestamp(),
    }
    
    return new Promise((resolve, reject) => {
      if(values.shared) {
        createSharedCollection(name, initValues)
        .then(res => resolve(res))
        .catch(e => reject(e))
      } else {
        createPrivateCollection(name, initValues)
        .then(res => resolve(res))
        .catch(e => reject(e))
      }
    })
}
  
export const removeCollection = (name) => {
    return new Promise((resolve, reject) => {
        remove(ref(
            database, 'users/' + auth.currentUser.uid + '/collections/' + name
        ))
        .catch(e => reject(e))
        remove(ref(
            database, 'users/' + auth.currentUser.uid + '/itemdata/' + name
        ))
        .catch(e => reject(e))
        
        resolve()
    })
}